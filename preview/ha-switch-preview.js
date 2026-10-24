// Standalone preview only. Never bundled into the card or used to replace HA's component.
if (!customElements.get('ha-switch')) {
  customElements.define('ha-switch', class extends HTMLElement {
    static observedAttributes = ['checked', 'disabled', 'aria-label'];
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).innerHTML = `<style>
        :host{display:inline-block;width:48px;height:40px}label{position:relative;display:block;width:48px;height:40px}
        input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;z-index:1}
        .track{position:absolute;top:8px;left:0;width:48px;height:24px;box-sizing:border-box;border:1px solid var(--secondary-text-color,#777);border-radius:14px;background:var(--secondary-background-color,#eee);pointer-events:none}
        .track::after{content:'';position:absolute;top:2px;left:3px;width:18px;height:18px;border-radius:50%;background:var(--secondary-text-color,#777)}
        input:checked+.track{border-color:var(--primary-color,#009cbd);background:color-mix(in srgb,var(--primary-color,#009cbd) 18%,var(--card-background-color,#fff))}
        input:checked+.track::after{left:25px;background:var(--primary-color,#009cbd)}
        input:focus-visible+.track{outline:2px solid var(--primary-color,#009cbd);outline-offset:3px}input:disabled+.track{opacity:.35}input:disabled{cursor:default}
      </style><label><input type="checkbox" role="switch"><span class="track"></span></label>`;
      this.input = this.shadowRoot.querySelector('input');
      this.input.addEventListener('change', event => {
        event.stopPropagation();
        this.checked = this.input.checked;
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      });
    }
    get checked() { return this.hasAttribute('checked'); }
    set checked(value) { this.toggleAttribute('checked', value); }
    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(value) { this.toggleAttribute('disabled', value); }
    attributeChangedCallback() {
      this.input.checked = this.checked;
      this.input.disabled = this.disabled;
      this.input.setAttribute('aria-label', this.getAttribute('aria-label') || 'Switch');
    }
    focus(options) { this.input.focus(options); }
    blur() { this.input.blur(); }
  });
}
