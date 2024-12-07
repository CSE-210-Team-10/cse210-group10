import css from './component.css';
import html from './template.html';

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

export class TaskItem extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [sheet];
  }

  static get observedAttributes() {
    return ['title', 'priority', 'category', 'date', 'tags', 'description'];
  }

  connectedCallback() {
    this.mountTemplate();
    this.render();
    this.addEventListeners();
  }

  attributeChangedCallback() {
    // Only update content if template is already mounted
    if (this.shadowRoot.querySelector('details')) {
      this.render();
    }
  }

  mountTemplate() {
    this.shadowRoot.innerHTML = html;
  }

  render() {
    // Get all attributes
    const title = this.getAttribute('data-title') || '';
    const priority = this.getAttribute('data-priority') || '';
    const date = this.getAttribute('data-date') || '';
    const description = this.getAttribute('data-description') || '';

    console.log(title);
    console.log(priority);
    console.log(date);
    console.log(description);

    // Update title
    const titleElement = this.shadowRoot.querySelector('.task-title');
    if (titleElement) titleElement.textContent = title;

    // Update date
    const dateElement = this.shadowRoot.querySelector('.task-date');
    if (dateElement) dateElement.textContent = date;

    // Update description
    const descriptionElement =
      this.shadowRoot.querySelector('.task-description');
    if (descriptionElement) descriptionElement.textContent = description;

    // Update tags
    const tagsContainer = this.shadowRoot.querySelector('.tags');
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
    try {
      /** @type {string[]} */
      const tags = JSON.parse(this.getAttribute('data-tags') || '[]');
      console.log(tags);

      tags.forEach(tag => {
        const tagElement = document.createElement('li');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
        console.log(tag);
      });
    } catch (e) {
      console.error('Failed to parse tags:', e);
    }
  }

  addEventListeners() {
    const editButton = this.shadowRoot.querySelector('.edit-button');
    const deleteButton = this.shadowRoot.querySelector('.delete-button');
    const completeButton = this.shadowRoot.querySelector('.complete-button');

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
  }
}
