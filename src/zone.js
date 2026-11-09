import { translate } from './localize.js';
import { validZoneCalibration, zoneRobotRectangle, zoneCanStart, zoneSha256 } from './zone-core.js';

// Owns the frozen image and pointer interaction. HA updates never replace its DOM.
class DysonPlannerZone extends HTMLElement {
  constructor() {
    super(); this.attachShadow({ mode: 'open' }); this.language = 'en';
    this.shadowRoot.innerHTML = `<style>
      :host{display:block;color:var(--primary-text-color);font:inherit}*{box-sizing:border-box}
      .intro,.toolbar,.message,.actions{margin:12px var(--dp-padding,20px)}
      .intro,.message{font-size:13px;color:var(--dp-muted);line-height:1.5}.message{min-height:20px}
      .toolbar,.actions{display:flex;gap:8px;flex-wrap:wrap}.actions{padding-bottom:14px}
      button{font:inherit;color:inherit;border:1px solid var(--dp-line);border-radius:12px;padding:8px 12px;min-height:44px;background:var(--dp-modern-surface,var(--dp-bg));cursor:pointer}
      button:disabled{opacity:.45;cursor:default}button:focus-visible{outline:2px solid var(--dp-accent);outline-offset:2px}
      .start{background:var(--dp-accent);color:var(--text-primary-color,#fff);flex:1}.back{flex:1}
      svg{display:block;width:100%;height:auto;background:var(--dp-bg);overflow:hidden}
      .area{fill:color-mix(in srgb,var(--dp-accent) 22%,transparent);stroke:var(--dp-accent);stroke-width:2;vector-effect:non-scaling-stroke;cursor:move;touch-action:none}
      .handle{fill:var(--dp-accent);stroke:white;stroke-width:2;vector-effect:non-scaling-stroke;cursor:nwse-resize;touch-action:none}
      [tabindex]:focus{outline:none;stroke:white;stroke-width:3}.hint{fill:white;pointer-events:none;font:22px sans-serif}
      [hidden]{display:none!important}
    </style><p class="intro"></p><div class="toolbar"><button data-do="add"></button><button data-do="remove"></button><button data-do="refresh"></button></div>
    <svg hidden aria-label="Zone selection"><image/><rect class="area" tabindex="0" role="button"/><rect class="handle" tabindex="0" role="button" rx="6"/><text class="hint" text-anchor="middle" dominant-baseline="central">↘</text></svg>
    <p class="message" role="status" aria-live="polite"></p><div class="actions"><button class="back" data-do="back"></button><button class="start" data-do="start"></button></div>`;
    this.svg = this.shadowRoot.querySelector('svg');
    this.image = this.shadowRoot.querySelector('image');
    this.area = this.shadowRoot.querySelector('.area');
    this.handle = this.shadowRoot.querySelector('.handle');
    this.hint = this.shadowRoot.querySelector('.hint');
    this.shadowRoot.addEventListener('click', event => {
      const action = event.target.closest('button')?.dataset.do;
      if (!action || event.target.closest('button').disabled) return;
      if (action === 'back') this.dispatchEvent(new CustomEvent('zone-back', { bubbles: true, composed: true }));
      if (action === 'refresh') this.load();
      if (action === 'add') { this.rect = [.3,.3,.7,.7]; this.draw(); }
      if (action === 'remove') { this.rect = null; this.draw(); }
      if (action === 'start') this.start();
    });
    this.svg.addEventListener('pointerdown', event => this.pointerDown(event));
    this.svg.addEventListener('pointermove', event => this.pointerMove(event));
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) this.svg.addEventListener(name, () => { this.drag = null; });
    this.svg.addEventListener('keydown', event => {
      if (!this.rect || this.sending || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const step = event.shiftKey ? .05 : .01;
      this.adjust(this.rect, event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0,
        event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0, event.target === this.handle);
    });
  }
  connectedCallback() { this.observer = new ResizeObserver(() => this.draw()); this.observer.observe(this); }
  disconnectedCallback() {
    this.controller?.abort(); this.observer?.disconnect(); this.drag = null;
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null; this.calibration = null;
  }
  setOptions(options) {
    const changed = this.vacuum !== options.vacuum || this.camera !== options.camera || this.rotation !== options.rotation
      || this.hass?.connection !== options.hass.connection;
    Object.assign(this, options);
    if (changed) { this.controller?.abort(); this.attempted = false; this.clear(); }
    if (this.calibration && String(this.hass.states[this.vacuum]?.attributes?.map_id) !== this.calibration.map_id) {
      this.controller?.abort(); this.clear(); this.note = 'The active map changed. Reload the map and select a new zone.';
    }
    if (this._labelsLanguage !== this.language) { this.labels(); this._labelsLanguage = this.language; }
    this.draw();
    if (!this.attempted && this.trusted && this.camera) this.load();
  }
  t(key) { return translate(this.language, key); }
  labels() {
    this.shadowRoot.querySelector('.intro').textContent = this.t('Vacuum · Auto · One pass. Add a zone, then drag it or resize its lower-right corner.');
    for (const [action, label] of Object.entries({add:'+ Add zone',remove:'Remove zone',refresh:'Reload map',back:'Back to rooms',start:'Start clean'})) {
      this.shadowRoot.querySelector(`[data-do="${action}"]`).textContent = this.t(label);
    }
    this.svg.setAttribute('aria-label', this.t('Zone selection'));
    this.area.setAttribute('aria-label', this.t('Move zone. Use the arrow keys.'));
    this.handle.setAttribute('aria-label', this.t('Resize zone. Use the arrow keys.'));
  }
  clear() {
    this.calibration = null; this.rect = null; this.drag = null;
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null; this.image.removeAttribute('href');
  }
  async load() {
    if (this.sending) return;
    this.controller?.abort(); this.clear(); this.attempted = true;
    const controller = new AbortController(); this.controller = controller;
    const timeout = setTimeout(() => controller.abort(), 12000);
    this.note = 'Loading calibrated map …'; this.draw();
    let objectUrl;
    try {
      if (!this.trusted) throw new Error('Camera must belong to the selected robot.');
      // A camera GET may publish its calibration after the image response arrives.
      // Retry reads only; a cleaning command is never retried automatically.
      for (let attempt = 0; attempt < 3; attempt++) {
        const picture = this.hass.states[this.camera]?.attributes?.entity_picture;
        if (typeof picture !== 'string' || !picture.startsWith('/api/camera_proxy/')) throw new Error('Camera image unavailable.');
        const url = new URL(this.hass.hassUrl ? this.hass.hassUrl(picture) : picture, location.href);
        url.searchParams.set('_zone', String(Date.now()));
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store', credentials: 'same-origin' });
        if (!response.ok) throw new Error('Camera image unavailable.');
        const blob = await response.blob();
        if (blob.size > 20 * 1024 * 1024) throw new Error('A calibrated PNG image is required.');
        const bytes = new Uint8Array(await blob.arrayBuffer());
        // HA cameras may retain their default JPEG content type for PNG bytes.
        if (![137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v)) throw new Error('A calibrated PNG image is required.');
        const hash = globalThis.crypto?.subtle
          ? [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(v => v.toString(16).padStart(2,'0')).join('')
          : zoneSha256(bytes);
        for (let poll = 0; poll < 8; poll++) {
          if (controller.signal.aborted || this.controller !== controller || !this.isConnected) return;
          const c = this.hass.states[this.camera]?.attributes?.map_calibration;
          if (validZoneCalibration(c) && c.image_sha256 === hash
              && String(this.hass.states[this.vacuum]?.attributes?.map_id) === String(c.map_id)) {
            objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
            const img = new Image(); img.src = objectUrl; await img.decode();
            if (controller.signal.aborted || this.controller !== controller || !this.isConnected) return;
            if (img.naturalWidth !== c.image_width || img.naturalHeight !== c.image_height) throw new Error('Image and calibration do not match. Reload the map.');
            this.calibration = structuredClone(c); this.calibration.map_id = String(c.map_id);
            this.objectUrl = objectUrl; objectUrl = null; this.image.setAttribute('href', this.objectUrl);
            this.note = ''; return;
          }
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      }
      throw new Error('Image and calibration do not match. Reload the map.');
    } catch (error) {
      if (this.controller === controller) this.note = controller.signal.aborted ? 'Map loading timed out. Reload the map.' : error.message;
    } finally {
      clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (this.controller === controller) { this.controller = null; this.draw(); }
    }
  }
  draw() {
    if (!this.svg) return;
    const c = this.calibration, rotated = this.rotation === 90 || this.rotation === 270;
    // Safari can scroll a focused SVG back into view when its geometry is
    // rewritten. HA telemetry must not touch the frozen selection's DOM.
    const geometry = JSON.stringify([c, this.rotation, this.rect, this.svg.getBoundingClientRect().width]);
    const geometryChanged = geometry !== this._geometry;
    this._geometry = geometry;
    if (geometryChanged) {
      this.svg.toggleAttribute('hidden', !c);
      if (c) {
        this.width = rotated ? c.image_height : c.image_width; this.height = rotated ? c.image_width : c.image_height;
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        this.image.setAttribute('width', c.image_width); this.image.setAttribute('height', c.image_height);
        const transform = this.rotation === 90 ? `translate(${c.image_height} 0) rotate(90)`
          : this.rotation === 180 ? `translate(${c.image_width} ${c.image_height}) rotate(180)`
          : this.rotation === 270 ? `translate(0 ${c.image_width}) rotate(270)` : '';
        this.image.setAttribute('transform', transform);
      }
      for (const el of [this.area,this.handle,this.hint]) el.toggleAttribute('hidden', !this.rect);
      if (c && this.rect) {
        const [x,y,x2,y2] = this.rect, size = Math.min(this.width * .14, 36 * this.width / (this.svg.getBoundingClientRect().width || this.width));
        for (const [key,value] of Object.entries({ x:x*this.width,y:y*this.height,width:(x2-x)*this.width,height:(y2-y)*this.height })) this.area.setAttribute(key,value);
        for (const [key,value] of Object.entries({ x:x2*this.width-size,y:y2*this.height-size,width:size,height:size })) this.handle.setAttribute(key,value);
        this.hint.setAttribute('x',x2*this.width-size/2); this.hint.setAttribute('y',y2*this.height-size/2);
        this.hint.style.fontSize = `${size*.65}px`;
      }
    }
    const ready = zoneCanStart(this.hass,this.vacuum,this.camera,c,this.trusted,this.preview);
    for (const action of ['add','remove','refresh','back','start']) {
      const button = this.shadowRoot.querySelector(`[data-do="${action}"]`);
      const disabled = !!this.sending
        || (action === 'start' && (!ready || !this.rect || !!this.controller))
        || (action === 'add' && (!c || !!this.rect)) || (action === 'remove' && !this.rect)
        || (action === 'refresh' && !!this.controller);
      if (button.disabled !== disabled) button.disabled = disabled;
    }
    const message = this.t(this.note || (!this.trusted ? 'Camera must belong to the selected robot.'
      : !c ? 'A calibrated map is required. Reload the map.' : !ready ? 'Zone start unavailable: check robot readiness, map and integration action.'
      : !this.rect ? 'Add a rectangle to select the cleaning area.' : 'Map frozen for selection. Room settings remain unchanged.'));
    const notice = this.shadowRoot.querySelector('.message');
    if (notice.textContent !== message) notice.textContent = message;
  }
  point(event) {
    const p = new DOMPoint(event.clientX,event.clientY).matrixTransform(this.svg.getScreenCTM().inverse());
    return [p.x/this.width,p.y/this.height];
  }
  pointerDown(event) {
    if (!this.rect || this.sending || (event.pointerType === 'mouse' && event.button !== 0)
      || ![this.area,this.handle].includes(event.target)) return;
    event.preventDefault(); this.drag = { id:event.pointerId,start:this.point(event),rect:[...this.rect],resize:event.target === this.handle };
    this.svg.setPointerCapture(event.pointerId);
  }
  pointerMove(event) {
    if (!this.drag || this.drag.id !== event.pointerId) return;
    event.preventDefault(); const p = this.point(event);
    this.adjust(this.drag.rect,p[0]-this.drag.start[0],p[1]-this.drag.start[1],this.drag.resize);
  }
  adjust(rect,dx,dy,resize) {
    const [x,y,x2,y2] = rect;
    if (resize) this.rect = [x,y,Math.min(1,Math.max(x+.04,x2+dx)),Math.min(1,Math.max(y+.04,y2+dy))];
    else { dx=Math.max(-x,Math.min(1-x2,dx)); dy=Math.max(-y,Math.min(1-y2,dy)); this.rect=[x+dx,y+dy,x2+dx,y2+dy]; }
    this.draw();
  }
  async start() {
    if (this.sending || !this.rect || !zoneCanStart(this.hass,this.vacuum,this.camera,this.calibration,this.trusted,this.preview)) return;
    const data = { entity_id:this.vacuum,map_id:this.calibration.map_id,rectangle:zoneRobotRectangle(this.rect,this.calibration,this.rotation) };
    this.sending = true; this.note = 'Sending zone start …'; this.draw();
    try {
      await this.hass.callService('dyson_spot_scrub','clean_zone',data);
      if (this.isConnected) this.dispatchEvent(new CustomEvent('zone-started',{bubbles:true,composed:true}));
    } catch (error) {
      if (this.isConnected) this.note = error.message || 'Zone start failed. Check the robot before retrying.';
    } finally { this.sending = false; if (this.isConnected) this.draw(); }
  }
}
if (!customElements.get('dyson-planner-zone')) customElements.define('dyson-planner-zone', DysonPlannerZone);
