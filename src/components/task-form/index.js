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
  prioritySelect: 'select[name="priority"]',
  descriptionInput: 'textarea[name="description"]',
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
      id: this.dataset.id,
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

    this.close();
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

    tagContainer.innerHTML = this.tags
      .map((tag, index) => tagHTMLGenerator(tag, index))
      .join('');

    tagCount.textContent = `(${this.tags.length}/${MAX_TAGS})`;

    tagInput.disabled = this.tags.length >= MAX_TAGS;
    tagInput.placeholder =
      this.tags.length >= MAX_TAGS
        ? 'Max tags reached'
        : 'Enter tags (press Enter to add)';

    this.addRemoveBtnEventListeners();
  }

  /**
   * Add event listeners to the remove button to handle removing tags
   */
  addRemoveBtnEventListeners() {
    const tagContainer = this.shadowRoot.querySelector(UISelector.tagContainer);
    /** @type { NodeListOf<HTMLButtonElement> } */
    const removeButtons = tagContainer.querySelectorAll(
      UISelector.tagRemoveBtn
    );

    removeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index, 10);
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
   * Clears all fields in the form, resetting them to their default values
   */
  clearForm() {
    /** @type { HTMLFormElement } */
    const form = this.shadowRoot.querySelector(UISelector.form);

    /** @type { HTMLInputElement } */
    const taskNameInput = form.querySelector(UISelector.taskNameInput);

    /** @type { HTMLTextAreaElement } */
    const descriptionInput = form.querySelector(UISelector.descriptionInput);

    /** @type { HTMLInputElement } */
    const tagInput = form.querySelector(UISelector.tagInput);

    // Reset text inputs
    taskNameInput.value = '';
    descriptionInput.value = '';
    tagInput.value = '';

    // Clear tags
    this.tags = [];
    this.updateTags();

    // Clear any error messages
    this.clearError();

    // Clear the id from dataset if it exists
    this.dataset.id = '';
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
   * Fills the form with provided task data
   * @param { object } taskData - The data to fill the form with
   * @param { number } [taskData.id] - The id of the task
   * @param { string } [taskData.taskName] - The name of the task
   * @param { 'High' | 'Medium' | 'Low' } [taskData.priority] - The priority level
   * @param { string[] } [taskData.tags] - Array of tags
   * @param { string | Date } [taskData.dueDate] - The due date
   * @param { string } [taskData.description] - Task description
   */
  fill(taskData) {
    const { taskName, priority, tags = [], dueDate, description } = taskData;

    // Get form elements

    /** @type { HTMLFormElement } */
    const form = this.shadowRoot.querySelector(UISelector.form);

    /** @type { HTMLInputElement } */
    const dateInput = form.querySelector(UISelector.dateInput);

    /** @type { HTMLInputElement } */
    const taskNameInput = form.querySelector(UISelector.taskNameInput);

    /** @type { HTMLSelectElement } */
    const prioritySelect = form.querySelector(UISelector.prioritySelect);

    /** @type { HTMLInputElement } */
    const descriptionInput = form.querySelector(UISelector.descriptionInput);

    if (taskData.id) this.dataset.id = String(taskData.id);

    // Fill task name
    if (taskName) {
      if (taskName.length > MAX_TASK_NAME_LENGTH) {
        this.setError(
          `Task name must be ${MAX_TASK_NAME_LENGTH} characters or less`
        );
        taskNameInput.value = taskName.slice(0, MAX_TASK_NAME_LENGTH);
      } else {
        taskNameInput.value = taskName;
      }
    }

    // Fill priority
    if (priority) {
      const option = Array.from(prioritySelect.options).find(
        opt => opt.value === priority
      );
      if (option) {
        prioritySelect.value = priority;
      }
    }

    // Fill tags
    this.tags = [];
    tags.forEach(tag => {
      if (this.tags.length < MAX_TAGS && tag.length <= MAX_TAG_LENGTH) {
        this.tags.push(tag);
      }
    });
    this.updateTags();

    // Fill due date
    if (dueDate) {
      const date = dueDate instanceof Date ? dueDate : new Date(dueDate);
      if (!isNaN(date.getTime())) {
        dateInput.valueAsDate = date;
      }
    }

    // Fill description
    if (description) {
      descriptionInput.value = description;
    }
  }

  /**
   *
   */
  render() {
    this.shadowRoot.innerHTML = html;
  }
}

customElements.define('task-form', TaskForm);
