import css from './component.css';
import html from './template.html';

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

const DataAttributeSelector = {
  title: 'data-title',
  priority: 'data-priority',
  date: 'data-date',
  tags: 'data-tags',
  interactive: 'interactive',
};

const UISelector = {
  slot: 'slot',
  details: 'details',
  title: '.task-title',
  priority: '.task-priority',
  date: '.task-date',
  tags: '.tags',
  editBtn: '.edit-btn',
  deleteBtn: '.delete-btn',
  completeBtn: '.complete-btn',
  collapseBtn: '.collapse-btn',
  interactiveBtns: '.interactive-btn',
};

/**
 * A custom component that displays details of a task and provides interaction
 */
export class TaskItem extends HTMLElement {
  static editTaskEvent = 'task-edit';
  static deleteTaskEvent = 'task-delete';
  static completeTaskEvent = 'task-complete';

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
    const { id } = this.dataset;
    if (!id)
      throw new Error(`TaskItem must have an id attribute ${this.title}`);

    this.mountTemplate();
    this.render();
    this.addEventListeners();
  }

  /**
   * Render the page whenever an attribute is updated
   */
  attributeChangedCallback() {
    // Only update content if template is already mounted
    if (this.shadowRoot.querySelector(UISelector.details)) {
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
   * @returns { boolean } Whether the task item is interactive
   */
  get interactive() {
    return this.type !== 'issue' && this.type !== 'pr';
  }

  /**
   * @returns { 'issue' | 'pr' | 'personal' } Type of the task item
   */
  get type() {
    const { type } = this.dataset;
    if (type === 'issue' || type === 'pr' || type === 'personal') return type;
    throw new Error(`Invalid type: ${type}`);
  }

  /**
   * @returns { string[] } a parsed string array of data-tags attribute
   * @throws { Error } if data-tags is non parseable
   */
  get tags() {
    try {
      return JSON.parse(
        this.getAttribute(DataAttributeSelector.tags).replaceAll('\'', '"') ||
          '[]'
      );
    } catch (error) {
      console.error('Error parsing tags:', error);
      return [];
    }
  }

  /**
   * @returns { string } the description of the task item
   */
  get description() {
    /** @type { HTMLSlotElement } */
    const slot = this.shadowRoot.querySelector(UISelector.slot);
    const nodes = slot.assignedNodes();

    const description = nodes
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent.replace(/\n\s*\n/g, '\n').trim())
      .join('')
      .trim();

    return description;
  }

  /**
   * Set the description of the task item
   */
  set description(value) {
    /** @type { HTMLSlotElement } */
    const slot = this.shadowRoot.querySelector(UISelector.slot);
    const nodes = slot.assignedNodes();

    // Find the text node(s)
    const textNodes = nodes.filter(node => node.nodeType === Node.TEXT_NODE);

    if (textNodes.length > 0) {
      textNodes[0].textContent = value;
    } else {
      // Create new text node if none exists
      const textNode = document.createTextNode(value);
      slot.appendChild(textNode);
    }
  }

  /**
   * @returns { string } the id of the task item
   */
  get id() {
    const { id } = this.dataset;

    if (id) return id;
    throw new Error('TaskItem must have an id attribute');
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
    let { title } = this;
    const { priority, date, tags, interactive, type } = this;

    const details = this.shadowRoot.querySelector(UISelector.details);

    /** @type { NodeListOf<HTMLButtonElement> } */
    const interactiveBtns = this.shadowRoot.querySelectorAll(
      UISelector.interactiveBtns
    );

    if (details) {
      details.classList.toggle('non-interactive', !interactive);
    }

    interactiveBtns.forEach(btn => {
      btn.style.display = interactive ? '' : 'none';
    });

    // Handle GitHub Tasks
    if (type === 'issue' || type === 'pr') {
      this.description = title.length > 15 ? `Full Title: ${title}` : '';
      title = title.length > 15 ? `${title.slice(0, 15)}...` : title;
    }

    // Update title
    const titleElement = this.shadowRoot.querySelector(UISelector.title);
    if (titleElement) titleElement.textContent = title;

    // Update date
    /** @type { HTMLSpanElement } */
    const dateElement = this.shadowRoot.querySelector(UISelector.date);
    if (dateElement) dateElement.textContent = date;
    if (type === 'issue' || type === 'pr') dateElement.style.display = 'none';

    // Update tags
    const tagsContainer = this.shadowRoot.querySelector(UISelector.tags);
    if (!tagsContainer) return;

    tagsContainer.innerHTML = '';

    // Add priority tag
    if (priority) {
      const priorityTag = document.createElement('li');
      priorityTag.className = `tag tag-priority-${priority.toLowerCase()}`;
      priorityTag.textContent = priority;
      tagsContainer.appendChild(priorityTag);
    }

    // Handle additional tags from JSON
    tags.forEach(tag => {
      const tagElement = document.createElement('li');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });
  }

  /**
   * Add event listeners to buttons and slots
   * Fire custom events for button clicked
   * And check description length for slot changed
   */
  addEventListeners() {
    /** @type { HTMLSlotElement | null } */
    const slot = this.shadowRoot.querySelector(UISelector.slot);

    /** @type { HTMLDetailsElement | null } */
    const details = this.shadowRoot.querySelector(UISelector.details);
    const editBtn = this.shadowRoot.querySelector(UISelector.editBtn);
    const deleteBtn = this.shadowRoot.querySelector(UISelector.deleteBtn);
    const completeBtn = this.shadowRoot.querySelector(UISelector.completeBtn);
    const collapseBtn = this.shadowRoot.querySelector(UISelector.collapseBtn);

    editBtn?.addEventListener('click', e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent(TaskItem.editTaskEvent, {
          detail: {
            id: this.id,
            title: this.title,
            priority: this.priority,
            date: this.date,
            tags: this.tags,
            description: this.description,
          },
          bubbles: true,
        })
      );
    });

    deleteBtn?.addEventListener('click', e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent(TaskItem.deleteTaskEvent, {
          detail: { id: this.id },
          bubbles: true,
        })
      );
    });

    completeBtn?.addEventListener('click', e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent(TaskItem.completeTaskEvent, {
          detail: { id: this.id },
          bubbles: true,
        })
      );
    });

    collapseBtn?.addEventListener('click', e => {
      e.preventDefault();
      details.open = !details.open;
    });

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

customElements.define('task-item', TaskItem);
