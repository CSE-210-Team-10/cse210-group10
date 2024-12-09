import html from './template.html';
import css from './component.css';

/**
 * @typedef { object } FilterData
 * @property { Array<'high' | 'medium' | 'low'> } priority - Selected priority filters
 * @property { Array<'issue' | 'pr'> } github - Selected GitHub type filters
 * @property { 'asc' | 'desc' } dateSort - Sort direction for dates
 */

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

const UISelector = {
  form: 'form',
  dialog: 'dialog',
  priorities: 'input[name="priority"]',
  githubTypes: 'input[name="github"]',
  dateSort: 'select[name="date"]',
  // Individual priority values
  highPriority: '#priority-high',
  mediumPriority: '#priority-medium',
  lowPriority: '#priority-low',
  // Individual GitHub type values
  issueType: '#issue',
  prType: '#pr',
};

/**
 *
 */
export class FilterForm extends HTMLElement {
  static filterFormSubmitEvent = 'filter-form-submit';

  /**
   *
   */
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [sheet];
  }

  /**
   *
   */
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  /**
   *
   */
  addEventListeners() {
    const form = this.shadowRoot.querySelector(UISelector.form);
    const dialog = this.shadowRoot.querySelector(UISelector.dialog);

    dialog.addEventListener('mousedown', this.handleClickOutside.bind(this));
    form.addEventListener('submit', this.handleFormSubmit.bind(this));
  }

  /**
   * Check if dialog is open and click target is the backdrop
   * dialog.contains(e.target) will be false when clicking the backdrop
   * because the backdrop is a pseudo-element
   * @param {MouseEvent} e a click event on the dialog
   */
  handleClickOutside(e) {
    /** @type { HTMLDialogElement } */
    const dialog = this.shadowRoot.querySelector(UISelector.dialog);
    if (dialog.open && e.target === dialog) dialog.close();
  }

  /**
   * Handle form submission and dispatch event with filter data
   * @param { SubmitEvent } e a submit event on the filter form
   */
  handleFormSubmit(e) {
    e.preventDefault();

    /** @type { HTMLFormElement } */
    const form = this.shadowRoot.querySelector(UISelector.form);
    const formData = new FormData(form);

    /** @type { FilterData } */
    const filtersData = {
      priority: /** @type { Array<'high' | 'medium' | 'low'> } */ (
        formData.getAll('priority')
      ),
      github: /** @type { Array<'issue' | 'pr'> } */ (
        formData.getAll('github')
      ),
      dateSort: /** @type { 'asc' | 'desc' } */ (
        formData.get('date') === 'newest' ? 'desc' : 'asc'
      ),
    };

    this.dispatchEvent(
      new CustomEvent(FilterForm.filterFormSubmitEvent, {
        detail: filtersData,
        bubbles: true,
      })
    );

    this.close();
  }

  /**
   *
   */
  render() {
    this.shadowRoot.innerHTML = html;
  }

  /**
   *
   */
  show() {
    /** @type { HTMLDialogElement } */
    const dialog = this.shadowRoot.querySelector(UISelector.dialog);
    dialog.showModal();
  }

  /**
   *
   */
  close() {
    /** @type { HTMLDialogElement } */
    const dialog = this.shadowRoot.querySelector(UISelector.dialog);

    this.clearForm();
    dialog.close();
  }

  /**
   * Reset the form to its initial state
   */
  clearForm() {
    /** @type { HTMLFormElement } */
    const form = this.shadowRoot.querySelector(UISelector.form);
    form.reset();
  }

  /**
   * Fill the form with the provided filter data
   * @param { FilterData } filtersData The filter data to fill the form with
   */
  fill(filtersData) {
    /** @type { HTMLFormElement } */
    const form = this.shadowRoot.querySelector(UISelector.form);

    /** @type { NodeListOf<HTMLInputElement> } */
    const priorityInputs = form.querySelectorAll(UISelector.priorities);

    /** @type { NodeListOf<HTMLInputElement> } */
    const githubInputs = form.querySelectorAll(UISelector.githubTypes);

    /** @type { HTMLSelectElement } */
    const dateSelect = form.querySelector(UISelector.dateSort);

    // Handle priority checkboxes
    priorityInputs.forEach(input => {
      input.checked = filtersData.priority.includes(
        /** @type { 'high' | 'medium' | 'low' } */ (input.value)
      );
    });

    // Handle GitHub type checkboxes
    githubInputs.forEach(input => {
      input.checked = filtersData.github.includes(
        /** @type { 'issue' | 'pr' } */ (input.value)
      );
    });

    // Handle date sort select element
    dateSelect.value = filtersData.dateSort === 'desc' ? 'newest' : 'oldest';
  }
}

customElements.define('filter-form', FilterForm);
