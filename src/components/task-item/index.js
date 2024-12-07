import css from './component.css';
import html from './template.html';

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

const DataAttributeSelector = {
  title: 'data-title',
  priority: 'data-priority',
  date: 'data-date',
  tags: 'data-tags',
};

const UISelector = {
  title: '.task-title',
  priority: '.task-priority',
  date: '.task-date',
  tags: '.task-tags',
  editBtn: '.edit-button',
  deleteBtn: '.delete-button',
  completeBtn: '.complete-button',
};

/**
 * A custom component that displays details of a task and provides interaction
 */
export class TaskItem extends HTMLElement {
  /**
   *
   */
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [sheet];
  }

  /**
   * @returns { string[] } A list of attributes to listen to
   */
  static get observedAttributes() {
    return Object.values(DataAttributeSelector); //
  }

  /**
   * Render and add event listeners when the component is mounted to the DOM
   */
  connectedCallback() {
    this.mountTemplate();
    this.render();
    this.addEventListeners();
  }

  /**
   * Render the page whenever an attribute is updated
   */
  attributeChangedCallback() {
    // Only update content if template is already mounted
    if (this.shadowRoot.querySelector('details')) {
      this.render();
    }
  }

  /**
   * @returns { string } value in data-title attribute
   */
  get title() {
    return this.getAttribute(DataAttributeSelector.title) || '';
  }

  /**
   * @returns { string } value in data-priority attribute
   */
  get priority() {
    return this.getAttribute(DataAttributeSelector.priority) || '';
  }

  /**
   * @returns { string } value in data-date attribute
   */
  get date() {
    return this.getAttribute(DataAttributeSelector.date) || '';
  }

  /**
   * @returns { string[] } a parsed string array of data-tags attribute
   * @throws { Error } if data-tags is non parseable
   */
  get tags() {
    try {
      return JSON.parse(this.getAttribute(DataAttributeSelector.tags) || '[]');
    } catch (error) {
      console.error('Error parsing tags:', error);
      return [];
    }
  }

  /**
   * Mount HTML code to the component
   */
  mountTemplate() {
    this.shadowRoot.innerHTML = html;
  }

  /**
   * Render the component
   */
  render() {
    // Get all attributes
    const { title, priority, date, tags } = this;

    // Update title
    const titleElement = this.shadowRoot.querySelector(UISelector.title);
    if (titleElement) titleElement.textContent = title;

    // Update date
    const dateElement = this.shadowRoot.querySelector(UISelector.date);
    if (dateElement) dateElement.textContent = date;

    // Update tags
    const tagsContainer = this.shadowRoot.querySelector(UISelector.tags);
    if (!tagsContainer) return;

    tagsContainer.innerHTML = '';

    // Add priority tag
    if (priority) {
      const priorityTag = document.createElement('li');
      priorityTag.className = `tag priority-${priority.toLowerCase()}`;
      priorityTag.textContent = priority;
      tagsContainer.appendChild(priorityTag);
    }

    // Handle additional tags from JSON
    tags.forEach(tag => {
      const tagElement = document.createElement('li');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
      console.log(tag);
    });
  }

  /**
   * Add event listenrs to buttons and slots
   * Fire custom events for button clicked
   * And check description length for slot changed
   */
  addEventListeners() {
    const editButton = this.shadowRoot.querySelector(UISelector.editBtn);
    const deleteButton = this.shadowRoot.querySelector(UISelector.deleteBtn);
    const completeButton = this.shadowRoot.querySelector(
      UISelector.completeBtn
    );

    editButton?.addEventListener('click', e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent('task-edit', {
          detail: { id: this.getAttribute('id') },
        })
      );
    });

    deleteButton?.addEventListener('click', e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent('task-delete', {
          detail: { id: this.getAttribute('id') },
        })
      );
    });

    completeButton?.addEventListener('click', e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent('task-complete', {
          detail: { id: this.getAttribute('id') },
        })
      );
    });

    const slot = this.shadowRoot.querySelector('slot');
    slot?.addEventListener('slotchange', () => {
      const nodes = slot.assignedNodes();
      const description = nodes
        .map(node => node.textContent)
        .join('')
        .trim();

      if (description.length > 500) console.warn('Description is too long');
    });
  }
}
