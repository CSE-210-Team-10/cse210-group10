// index.js
import html from './template.html';
import css from './template.css';

/**
 *
 */
class CollapsibleCard extends HTMLElement {
  static observedAttributes = ['open'];

  /**
   *
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Create and adopt stylesheet
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  /**
   *
   */
  connectedCallback() {
    // Add HTML
    this.shadowRoot.innerHTML = html;

    // Add event listeners
    this.shadowRoot
      .querySelector('.card-header')
      .addEventListener('click', () => this.toggle());
  }

  /**
   *
   */
  disconnectedCallback() {
    this.shadowRoot
      .querySelector('.card-header')
      .removeEventListener('click', () => this.toggle());
  }

  /**
   *
   * @param {string} name The name of the attribute changed
   * @param {string} oldValue The old value of the attribute
   * @param {string} newValue The new value of the attribute
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      this._dispatchStateChange();
      if (oldValue === newValue) return;
    }
  }

  /**
   *
   */
  toggle() {
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    } else {
      this.setAttribute('open', '');
    }
  }

  /**
   *
   */
  _dispatchStateChange() {
    const event = new CustomEvent('state-change', {
      detail: { open: this.hasAttribute('open') },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define('collapsible-card', CollapsibleCard);
