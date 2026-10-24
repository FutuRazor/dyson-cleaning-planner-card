// Preview only: production uses Home Assistant's own ha-button component.
if (!customElements.get('ha-button')) {
  customElements.define('ha-button', class extends HTMLElement {
    static observedAttributes = ['disabled', 'aria-label'];
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).innerHTML = `<style>
        button{font:inherit;color:var(--primary-color,#009cbd);border:0;background:transparent;padding:10px 14px;border-radius:18px;cursor:pointer}
        button:hover{background:color-mix(in srgb,var(--primary-color,#009cbd) 12%,transparent)}
        button:disabled{color:var(--disabled-text-color,#888);background:transparent;cursor:default}
      </style><button><slot></slot></button>`;
      this.button = this.shadowRoot.querySelector('button');
    }
    get disabled() { return this.hasAttribute('disabled'); }
    attributeChangedCallback() {
      this.button.disabled = this.disabled;
      this.button.setAttribute('aria-label', this.getAttribute('aria-label') || 'Press');
    }
    focus(options) { this.button.focus(options); }
    blur() { this.button.blur(); }
  });
}
