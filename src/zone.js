import { translate } from './localize.js';
import { validZoneCalibration, zoneRobotRectangle, zoneCanStart, zoneSha256 } from './zone-core.js';

// Owns the frozen image and pointer interaction. HA updates never replace its DOM.
class DysonPlannerZone extends HTMLElement {
  constructor() {
    super(); this.attachShadow({ mode: 'open' }); this.language = 'en'; this.strategy = 'auto';
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
      .settings-overlay{position:absolute;inset:0;z-index:5;background:#0005;padding:12px;display:flex;align-items:flex-start}
      .settings-panel{width:100%;max-height:min(100%,75vh);overflow-y:auto;overscroll-behavior:contain;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:14px;padding:18px;box-shadow:0 8px 30px #0003}
      .settings-panel header{display:flex;align-items:stretch;gap:8px;margin-bottom:20px}.settings-panel h3{flex:1;margin:0;align-self:center;font-size:16px;font-weight:500}
      .settings-panel [data-do=close-settings]{display:flex;align-items:center;justify-content:center;flex:0 0 42px;min-width:42px;padding:8px;min-height:42px;border-radius:9px;background:var(--dp-bg)}ha-icon{width:24px;height:24px}
      .settings-fields{padding:10px 14px;border:1px solid var(--dp-line);border-radius:14px;background:var(--dp-modern-surface,var(--dp-bg))}
      .settings-panel label{display:block;font-size:13px;color:var(--primary-text-color);margin:12px 0 4px}.settings-panel label:first-child{margin-top:0}
      .settings-panel select{width:100%;font:inherit;font-size:14px;min-height:34px;padding:6px 10px;border:1px solid var(--dp-modern-control-border,var(--dp-line));border-radius:9px;background:var(--dp-modern-control,var(--dp-bg));color:var(--dp-accent)}
      .unavailable{opacity:.5}.settings-note{font-size:12px;color:var(--dp-muted);margin:6px 0 10px}
      .segments{background:var(--dp-modern-control,var(--dp-bg));border-color:var(--dp-modern-control-border,var(--dp-line))}
      .actions{margin:14px var(--dp-padding,20px) 0;padding:12px 0 14px;border-top:1px solid var(--dp-line);gap:10px;flex-wrap:nowrap}
      .actions{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.secondary-actions{display:flex;gap:8px;min-width:0}.actions .reload{flex:0 0 38px;padding:6px;display:flex;align-items:center;justify-content:center}.actions button{flex:1;min-width:0;min-height:38px;padding:6px 12px;border-radius:13px;font-size:13px}.back{background:var(--dp-modern-surface,var(--dp-bg))}
.stepped-slider{position:relative;height:24px}
.slider-ticks{position:absolute;inset:0 10px;pointer-events:none;color:var(--dp-muted)}
.slider-ticks::before{content:"";position:absolute;left:0;right:0;top:10.5px;height:3px;border-radius:2px;background:currentColor;opacity:.65}
.slider-tick{position:absolute;left:calc(var(--stop)*100%);top:12px;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:currentColor}
.stepped-slider input[type=range]{position:relative;z-index:1;display:block;appearance:none;-webkit-appearance:none;width:100%;height:24px;margin:0;padding:0;border:0;background:transparent;cursor:pointer}
.stepped-slider input::-webkit-slider-runnable-track{height:3px;background:transparent;border:0}
.stepped-slider input::-moz-range-track{height:3px;background:transparent;border:0}
.stepped-slider input::-moz-range-progress{background:transparent}
.stepped-slider input::-webkit-slider-thumb{-webkit-appearance:none;box-sizing:border-box;width:20px;height:20px;margin-top:-8.5px;border:3px solid #f4fbfd;border-radius:50%;background:var(--dp-accent);box-shadow:0 1px 3px #0003}
.stepped-slider input::-moz-range-thumb{box-sizing:border-box;width:20px;height:20px;border:3px solid #f4fbfd;border-radius:50%;background:var(--dp-accent);box-shadow:0 1px 3px #0003}
.stepped-slider.disabled{opacity:.45}
.stepped-slider input:disabled{cursor:default}
.slider-options{position:relative;min-height:28px;margin:0 10px}.slider-options button{position:absolute;left:calc(var(--stop)*100%);transform:translateX(-50%);width:30%}.slider-options button:first-child{left:-10px;transform:none;text-align:left;padding-left:0}.slider-options button:last-child{left:calc(100% + 10px);transform:translateX(-100%);text-align:right;padding-right:0}
.slider-options button{border:0;background:transparent;padding:2px 2px;min-height:28px;font-size:12px;color:var(--dp-muted);overflow-wrap:anywhere}
.slider-options button[aria-pressed=true]{color:var(--dp-accent);font-weight:650}
.segments{display:flex;gap:3px;padding:3px;border:1px solid var(--dp-line);border-radius:12px}
.segments button{flex:1;min-width:0;min-height:32px;border:0;background:transparent;padding:3px 8px;position:relative}
.segments button::after{content:"";position:absolute;inset:-6px 0}
.segments button[aria-pressed=true]{background:var(--dp-accent);color:var(--text-primary-color,#fff)}
      .zone-settings-open{display:flex;align-items:center;justify-content:space-between;gap:6px;text-align:left}.zone-mode-label{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.zone-settings-open ha-icon{display:flex;align-items:center;justify-content:center;line-height:0;align-self:center;flex:0 0 15px;width:15px;height:15px;--mdc-icon-size:15px}
      [hidden]{display:none!important}
    </style>
    <svg hidden aria-label="Zone selection"><image/><rect class="area" tabindex="0" role="button"/><rect class="handle" tabindex="0" role="button" rx="6"/><text class="hint" text-anchor="middle" dominant-baseline="central">↘</text></svg>
    <p class="message" role="status" aria-live="polite"></p><div class="actions"><div class="secondary-actions"><button class="reload" data-do="refresh"><ha-icon icon="mdi:reload" aria-hidden="true"></ha-icon></button><button class="zone-settings-open" data-do="settings" aria-haspopup="dialog"><span class="zone-mode-label"></span><ha-icon icon="mdi:cog" aria-hidden="true"></ha-icon></button></div><button class="start" data-do="start"></button></div>
    <div class="settings-overlay" hidden><section class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="zone-settings-title"><header><h3 id="zone-settings-title" data-i18n="Settings"></h3><button data-do="close-settings" aria-label="Close"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></header><div class="settings-fields">
      <label for="zone-mode" data-i18n="Cleaning mode"></label><select id="zone-mode"><option data-i18n="Vacuum"></option><option disabled data-i18n="Vacuum and Mop"></option><option disabled data-i18n="Mop"></option><option disabled data-i18n="Vacuum then Mop"></option></select>
      <p class="settings-note" data-i18n="Other cleaning modes are not yet available."></p>
      <label for="zone-power" data-i18n="Vacuum Power"></label><div class="stepped-slider"><div class="slider-ticks" aria-hidden="true">${[0,1,2,3].map(i=>`<span class="slider-tick" style="--stop:${i/3}"></span>`).join('')}</div><input id="zone-power" class="zone-power" type="range" min="0" max="3" step="1" value="0"></div>
      <div class="slider-options">${['Auto','Boost','Quiet','Quick'].map((name,i)=>`<button type="button" data-power="${i}" style="--stop:${i/3}" data-i18n="${name}"></button>`).join('')}</div>
      <div class="unavailable"><label for="zone-water" data-i18n="Water level"></label><select id="zone-water" disabled><option data-i18n="Not yet available"></option></select></div>
      <label data-i18n="Clean repetitions"></label><div class="segments"><button type="button" aria-pressed="true" disabled>1×</button><button type="button" disabled>2×</button></div><p class="settings-note" data-i18n="Two passes are not yet available."></p>
      <p class="settings-note" data-i18n="Settings are sent only when you start the zone clean."></p>
    </div></section></div>`;
    this.dialog = this.shadowRoot.querySelector('.settings-overlay');
    this.dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); this.closeSettings(); }
      if (event.key === 'Tab') {
        const items=[...this.dialog.querySelectorAll('button:not(:disabled),select:not(:disabled),input:not(:disabled)')];
        const first=items[0],last=items.at(-1),active=this.shadowRoot.activeElement;
        if (event.shiftKey && active===first) { event.preventDefault(); last.focus({preventScroll:true}); }
        else if (!event.shiftKey && active===last) { event.preventDefault(); first.focus({preventScroll:true}); }
      }
    });
    this.shadowRoot.querySelector('.zone-power').addEventListener('input', event => {
      this.strategy = ['auto','boost','quiet','quick'][Number(event.target.value)]; this.labels();
    });
    this.svg = this.shadowRoot.querySelector('svg');
    this.image = this.shadowRoot.querySelector('image');
    this.area = this.shadowRoot.querySelector('.area');
    this.handle = this.shadowRoot.querySelector('.handle');
    this.hint = this.shadowRoot.querySelector('.hint');
    this.shadowRoot.addEventListener('click', event => {
      const power = event.target.closest('[data-power]');
      if (power && !this.sending) { this.shadowRoot.querySelector('.zone-power').value=power.dataset.power; this.strategy=['auto','boost','quiet','quick'][Number(power.dataset.power)]; this.labels(); return; }
      const action = event.target.closest('button')?.dataset.do;
      if (!action || event.target.closest('button').disabled) return;
      if (action === 'refresh') this.load();
      if (action === 'settings') { this.dialog.hidden=false; this.shadowRoot.querySelector('[data-do="close-settings"]').focus({preventScroll:true}); }
      if (action === 'close-settings') this.closeSettings();
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
  snapshot() {
    return { strategy:this.strategy, calibration:this.calibration, rect:this.rect ? [...this.rect] : null,
      vacuum:this.vacuum, camera:this.camera, rotation:this.rotation };
  }
  closeSettings() {
    this.dialog.hidden=true;
    this.shadowRoot.querySelector('[data-do="settings"]').focus({preventScroll:true});
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
    if (changed) {
      this.controller?.abort(); this.attempted = false; this.clear();
      const saved=options.draft;
      this.restoreDraft=saved?.vacuum===this.vacuum && saved?.camera===this.camera && saved?.rotation===this.rotation ? saved : null;
      this.strategy=this.restoreDraft?.strategy || 'auto';
      this.shadowRoot.querySelector('.zone-power').value=['auto','boost','quiet','quick'].indexOf(this.strategy);
      this._labelsLanguage=null;
    }
    if (this.calibration && String(this.hass.states[this.vacuum]?.attributes?.map_id) !== this.calibration.map_id) {
      this.controller?.abort(); this.clear(); this.note = 'The active map changed. Reload the map and select a new zone.';
    }
    if (this._labelsLanguage !== this.language) { this.labels(); this._labelsLanguage = this.language; }
    this.draw();
    if (!this.attempted && this.trusted && this.camera) this.load();
  }
  t(key) { return translate(this.language, key); }
  labels() {

    for (const el of this.shadowRoot.querySelectorAll('[data-i18n]')) el.textContent = this.t(el.dataset.i18n);
    this.shadowRoot.querySelector('[data-do="close-settings"]').setAttribute('aria-label',this.t('Close'));
    [...this.shadowRoot.querySelectorAll('[data-power]')].forEach((el,i)=>el.setAttribute('aria-pressed',String(i===['auto','boost','quiet','quick'].indexOf(this.strategy))));
    this.shadowRoot.querySelector('.zone-power').setAttribute('aria-valuetext',this.t(this.strategy[0].toUpperCase()+this.strategy.slice(1)));
    for (const [action, label] of Object.entries({start:'Start clean'})) {
      this.shadowRoot.querySelector(`[data-do="${action}"]`).textContent = this.t(label);
    }
    this.shadowRoot.querySelector('[data-do="refresh"]').setAttribute('aria-label',this.t('Reload map'));
    this.shadowRoot.querySelector('[data-do="refresh"]').title=this.t('Reload map');
    // Vacuum is the only verified zone mode; update this label when more modes are supported.
    this.shadowRoot.querySelector('.zone-mode-label').textContent=this.t('Vacuum');
    const settingsButton=this.shadowRoot.querySelector('[data-do="settings"]');
    settingsButton.setAttribute('aria-label',`${this.t('Vacuum')} – ${this.t('Settings')}`);
    settingsButton.title=`${this.t('Vacuum')} – ${this.t('Settings')}`;
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
    const previous = this.calibration && this.rect ? { calibration: this.calibration, rect: [...this.rect] } : this.restoreDraft;
    this.restoreDraft = null;
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
        // Never request a resized proxy image: calibration hashes original bytes.
        url.searchParams.delete('width'); url.searchParams.delete('height');
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
            const sameTransform = previous?.calibration && previous.rect && ['version','map_id','units','image_width','image_height','pixels_per_metre','padding','min_x','max_y']
              .every(key => String(previous.calibration[key]) === String(c[key]));
            this.rect = sameTransform ? previous.rect : [.3,.3,.7,.7];
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
        // Keep the grip outside the selected area when there is room. Flip each
        // axis inward near the image edge without changing the zone or drag origin.
        const edgeX = x2*this.width, edgeY = y2*this.height;
        const strokeMargin = this.width / (this.svg.getBoundingClientRect().width || this.width);
        const handleX = this.width-edgeX >= size+strokeMargin ? edgeX : edgeX-size;
        const handleY = this.height-edgeY >= size+strokeMargin ? edgeY : edgeY-size;
        for (const [key,value] of Object.entries({ x:handleX,y:handleY,width:size,height:size })) this.handle.setAttribute(key,value);
        this.hint.setAttribute('x',handleX+size/2); this.hint.setAttribute('y',handleY+size/2);
        this.hint.style.fontSize = `${size*.65}px`;
      }
    }
    const ready = zoneCanStart(this.hass,this.vacuum,this.camera,c,this.trusted,this.preview);
    for (const action of ['settings','refresh','start']) {
      const button = this.shadowRoot.querySelector(`[data-do="${action}"]`);
      const disabled = !!this.sending
        || (action === 'start' && (!ready || !this.rect || !!this.controller))
        || (action === 'refresh' && !!this.controller);
      if (button.disabled !== disabled) button.disabled = disabled;
    }
    const message = this.t(this.note || (!this.trusted ? 'Camera must belong to the selected robot.'
      : !c ? 'A calibrated map is required. Reload the map.' : !ready ? 'Zone start unavailable: check robot readiness, map and integration action.'
      : ''));
    const notice = this.shadowRoot.querySelector('.message');
    notice.hidden = !message;
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
    const data = { entity_id:this.vacuum,map_id:this.calibration.map_id,rectangle:zoneRobotRectangle(this.rect,this.calibration,this.rotation),cleaning_strategy:this.strategy };
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
