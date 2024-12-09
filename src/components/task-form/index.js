import html from './template.html';
import css from './component.css';

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 10;
const MAX_TASK_NAME_LENGTH = 15;

const UISelector = {
  form: 'form',
  dialog: 'dialog',
  tagInput: '.tag-input',
  dateInput: 'input[type="date"]',
  tagContainer: '.tags',
  tagCount: '.tag-count',
  tagRemoveBtn: '.tag-remove',
  taskNameInput: 'input[name="taskName"]',
  errorMessage: '.error-message',
};

/**
 *
 * @param { string } tag text of the tag
 * @param { number } index index of the tag
 * @returns { string } the HTML code for the tag as string
 */
const tagHTMLGenerator = (tag, index) => `
<li class="tag tag-regular">
  ${tag}
  <button type="button" class="tag-remove" data-index="${index}">×</button>
</li>
`;

/**
 *
 */
export class TaskForm extends HTMLElement {
  static taskFormSubmitEvent = 'task-form-submit';

  /**
   *
   */
  constructor() {
    super();
    this.tags = [];
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [sheet];
  }

  /**
   *
   */
  connectedCallback() {
    this.render();
    this.addEventListeners();

    /** @type { HTMLInputElement } */
    const dateInput = this.shadowRoot.querySelector(UISelector.dateInput);
    dateInput.valueAsDate = new Date();
  }

  /**
   *
   */
  disconnectedCallback() {
    const tagInput = this.shadowRoot.querySelector(UISelector.tagInput);
    const form = this.shadowRoot.querySelector(UISelector.form);
    const dialog = this.shadowRoot.querySelector(UISelector.dialog);
    const taskNameInput = this.shadowRoot.querySelector(
      UISelector.taskNameInput
    );

    // Remove all listeners
    dialog.removeEventListener('mousedown', this.handleClickOutside);
    taskNameInput.removeEventListener('input', this.handleTaskNameInput);
    tagInput.removeEventListener('keydown', this.handleTagInputKeyDown);
    tagInput.removeEventListener('input', this.handleTagInput);
    form.removeEventListener('submit', this.handleFormSubmit);
  }

  /**
   *
   */
  addEventListeners() {
    const tagInput = this.shadowRoot.querySelector(UISelector.tagInput);
    const form = this.shadowRoot.querySelector(UISelector.form);
    const dialog = this.shadowRoot.querySelector(UISelector.dialog);
    const taskNameInput = this.shadowRoot.querySelector(
      UISelector.taskNameInput
    );

    dialog.addEventListener('mousedown', this.handleClickOutside.bind(this));
    tagInput.addEventListener('keydown', this.handleTagInputKeyDown.bind(this));
    tagInput.addEventListener('input', this.handleTagInput.bind(this));
    form.addEventListener('submit', this.handleFormSubmit.bind(this));
    taskNameInput.addEventListener(
      'input',
      this.handleTaskNameInput.bind(this)
    );
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
   *
   * @param { InputEvent & { target: HTMLInputElement } } e an input event on the task name input
   */
  handleTaskNameInput(e) {
    if (e.target.value.length > MAX_TASK_NAME_LENGTH) {
      e.target.value = e.target.value.slice(0, MAX_TASK_NAME_LENGTH);
      this.setError(
        `Task name must be ${MAX_TASK_NAME_LENGTH} characters or less`
      );
    } else {
      this.clearError();
    }
  }

  /**
   *
   * @param { KeyboardEvent & { target: HTMLInputElement } } e an input event on the task tag input
   */
  handleTagInputKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.addTag(e.target.value);
      e.target.value = '';
    } else if (
      e.key === 'Backspace' &&
      !e.target.value &&
      this.tags.length > 0
    ) {
      this.tags.pop();
      this.updateTags();
      this.clearError();
    }
  }

  /**
   *
   * @param { InputEvent & { target: HTMLInputElement } } e an input event on the task tag input
   */
  handleTagInput(e) {
    if (e.target.value.length > MAX_TAG_LENGTH) {
      e.target.value = e.target.value.slice(0, MAX_TAG_LENGTH);
      this.setError(`Tags must be ${MAX_TAG_LENGTH} characters or less`);
    } else {
      this.clearError();
    }
  }

  /**
   *
   * @param { SubmitEvent } e a submit event on the create task form
   */
  handleFormSubmit(e) {
    e.preventDefault();

    /** @type { HTMLFormElement } */
    const form = this.shadowRoot.querySelector(UISelector.form);
    const formData = new FormData(form);
    const data = {
      taskName: formData.get('taskName'),
      priority: formData.get('priority'),
      tags: this.tags,
      dueDate: formData.get('dueDate'),
      description: formData.get('description'),
    };

    this.dispatchEvent(
      new CustomEvent(TaskForm.taskFormSubmitEvent, {
        detail: data,
        bubbles: true,
      })
    );
  }

  /**
   *
   * @param { string } userInput the input from the user to add the tag
   */
  addTag(userInput) {
    const value = userInput.trim();

    if (!value) return;

    if (value.length > MAX_TAG_LENGTH) {
      this.setError(`Tags must be ${MAX_TAG_LENGTH} characters or less`);
      return;
    }

    if (this.tags.length >= MAX_TAGS) {
      this.setError(`Maximum ${MAX_TAGS} tags allowed`);
      return;
    }

    this.tags.push(value);
    this.updateTags();
    this.clearError();
  }

  /**
   *
   */
  updateTags() {
    const tagContainer = this.shadowRoot.querySelector(UISelector.tagContainer);
    const tagCount = this.shadowRoot.querySelector(UISelector.tagCount);

    /** @type { HTMLInputElement } */
    const tagInput = this.shadowRoot.querySelector(UISelector.tagInput);

    /** @type { NodeListOf<HTMLButtonElement> } */
    const removeButtons = tagContainer.querySelectorAll(
      UISelector.tagRemoveBtn
    );

    tagContainer.innerHTML = this.tags
      .map((tag, index) => tagHTMLGenerator(tag, index))
      .join('');

    tagCount.textContent = `(${this.tags.length}/${MAX_TAGS})`;

    tagInput.disabled = this.tags.length >= MAX_TAGS;
    tagInput.placeholder =
      this.tags.length >= MAX_TAGS
        ? 'Max tags reached'
        : 'Enter tags (press Enter to add)';

    removeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index);
        this.tags.splice(index, 1);
        this.updateTags();
        this.clearError();
      });
    });
  }

  /**
   *
   * @param { string } message the error message to display
   */
  setError(message) {
    /** @type { HTMLSpanElement } */
    const errorElement = this.shadowRoot.querySelector(UISelector.errorMessage);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  /**
   *
   */
  clearError() {
    /** @type { HTMLSpanElement } */
    const errorElement = this.shadowRoot.querySelector(UISelector.errorMessage);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
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
    dialog.close();
  }

  /**
   *
   */
  render() {
    this.shadowRoot.innerHTML = html;
  }
}

customElements.define('task-form', TaskForm);
