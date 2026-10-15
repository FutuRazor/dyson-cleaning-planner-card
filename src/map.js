import { available, fitMap } from './core.js';

// Owns image refresh independently from card rendering. No direct Dyson calls.
class DysonPlannerMap extends HTMLElement {
  constructor() {
    super(); this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>
      :host{display:block;min-width:0}.viewport{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;background:var(--secondary-background-color,#f5f7f9);isolation:isolate}
      img{position:absolute;left:50%;top:50%;max-width:none;max-height:none;transform-origin:center;visibility:hidden}.placeholder{position:absolute;inset:0;display:grid;place-items:center;padding:16px;text-align:center;color:var(--secondary-text-color,#52616e);font:13px/1.5 Arial,sans-serif}
      .caption{margin:8px 0 0;padding:0 var(--dp-padding,24px);color:var(--secondary-text-color,#52616e);font:12px/1.5 Arial,sans-serif}.caption:empty{display:none}[hidden]{display:none}
      </style><div class="viewport"><img alt="Live cleaning map"><div class="placeholder">Loading cleaning map …</div></div><p class="caption" role="status" aria-live="polite"></p>`;
    this.img = this.shadowRoot.querySelector('img');
    this.viewport = this.shadowRoot.querySelector('.viewport');
    this.placeholder = this.shadowRoot.querySelector('.placeholder');
    this.caption = this.shadowRoot.querySelector('.caption');
    this.inView = false;
    this.visibilityChanged = () => this.schedule();
  }
  connectedCallback() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.viewport);
    this.intersectionObserver = new IntersectionObserver(entries => {
      this.inView = entries.some(e => e.isIntersecting);
      this.schedule();
    });
    this.intersectionObserver.observe(this);
    document.addEventListener('visibilitychange', this.visibilityChanged);
  }
  disconnectedCallback() {
    this.cancel(); this.resizeObserver?.disconnect(); this.intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.visibilityChanged);
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = undefined; this.img.removeAttribute('src'); this.img.style.visibility = 'hidden';
  }
  setOptions(hass, entity, rotation, live) {
    if (this.entity !== entity || this.hass?.connection !== hass.connection) {
      this.cancel();
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined; this.img.removeAttribute('src'); this.img.style.visibility = 'hidden';
      this.imageWidth = undefined; this.imageHeight = undefined;
      this.lastAttempt = 0; this.placeholder.hidden = false;
    }
    this.hass = hass; this.entity = entity; this.rotation = rotation; this.live = live;
    this.resize(); this.schedule();
  }
  cancel() {
    clearTimeout(this.timer); this.timer = undefined;
    this.abortController?.abort(); this.abortController = undefined;
  }
  schedule() {
    clearTimeout(this.timer); this.timer = undefined;
    if (!this.isConnected || !this.inView || document.hidden) { this.cancel(); return; }
    if (!this.live) { this.cancel(); this.showMessage('Waiting for an active robot status.'); return; }
    if (!this.entity || !available(this.hass?.states?.[this.entity])) {
      this.cancel();
      this.showMessage(this.entity ? 'Camera unavailable.' : 'No map camera found. Select one in the card editor.');
      return;
    }
    if (this.abortController) return;
    const delay = Math.max(0, 5000 - (Date.now() - (this.lastAttempt ?? 0)));
    this.timer = setTimeout(() => this.refresh(), delay);
  }
  showMessage(message) {
    this.placeholder.hidden = !!this.objectUrl;
    this.placeholder.textContent = message;
    this.caption.textContent = this.objectUrl ? `${message} Showing the last received image.` : message;
  }
  async refresh() {
    if (!this.isConnected || !this.inView || document.hidden || !this.live) return;
    const picture = this.hass.states[this.entity]?.attributes?.entity_picture;
    this.lastAttempt = Date.now();
    // Use the HA-provided proxy path/token; never save or log tokens in config.
    if (typeof picture !== 'string' || !picture.startsWith('/api/camera_proxy/')) {
      this.showMessage('The camera image is not available yet.'); this.schedule(); return;
    }
    const url = new URL(this.hass.hassUrl ? this.hass.hassUrl(picture) : picture, location.href);
    url.searchParams.set('_planner', String(this.lastAttempt));
    const controller = new AbortController(); this.abortController = controller;
    const timeout = setTimeout(() => controller.abort(), 10000);
    let objectUrl;
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Image request failed');
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) throw new Error('Invalid camera image');
      objectUrl = URL.createObjectURL(blob);
      const image = new Image(); image.src = objectUrl; await image.decode();
      if (controller !== this.abortController || controller.signal.aborted || !this.isConnected) return;
      const previous = this.objectUrl;
      this.objectUrl = objectUrl; objectUrl = undefined;
      this.imageWidth = image.naturalWidth; this.imageHeight = image.naturalHeight;
      this.img.src = this.objectUrl; this.img.style.visibility = 'visible';
      this.placeholder.hidden = true; this.resize();
      this.caption.textContent = '';
      if (previous) URL.revokeObjectURL(previous);
    } catch {
      if (controller === this.abortController) this.showMessage('Map update unavailable.');
    } finally {
      clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (controller === this.abortController) { this.abortController = undefined; this.schedule(); }
    }
  }
  resize() {
    const size = fitMap(this.imageWidth, this.imageHeight, this.viewport.getBoundingClientRect().width, this.rotation);
    // The card sets the width; the complete rotated image determines the height.
    // The CSS aspect ratio is only a placeholder until the first image arrives.
    this.viewport.style.height = size.frameHeight > 0 ? `${size.frameHeight}px` : '';
    this.img.style.width = `${size.width}px`; this.img.style.height = `${size.height}px`;
    this.img.style.transform = `translate(-50%, -50%) rotate(${this.rotation ?? 0}deg)`;
  }
}
if (!customElements.get('dyson-planner-map')) customElements.define('dyson-planner-map', DysonPlannerMap);
