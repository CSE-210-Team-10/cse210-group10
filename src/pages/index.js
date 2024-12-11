import { authService } from '../js/auth.js';
import { TaskItem } from '../components/task-item/index.js';
import { TaskForm } from '../components/task-form/index.js';
import TaskStore from '../js/task/crud.js';

import { main as filterMain } from './filters.js';
import { renderTaskPanels } from './render.js';

/** @typedef { import('../js/task/index.js').Task } Task */
/** @typedef { import('../js/auth.js').UserData } User */

/**
 * @typedef { object } TaskFormData
 * @property { string } id - ID of the task
 * @property { string } taskName - Name/title of the task
 * @property { 'high' | 'medium' | 'low' } priority - Priority level of the task
 * @property { string[] } tags - Array of tags associated with the task
 * @property { string } dueDate - Due date string from the form
 * @property { string } description - Description of the task
 */

/** @type { 'create' | 'edit' | null } current state of the task form */
let taskFormMode = null;

document.addEventListener('DOMContentLoaded', main);

/**
 *
 */
export function main() {
  authService.subscribeToAuthChanges(authEventHandler);

  /** @type { TaskForm } */
  const taskForm = document.querySelector('task-form');

  const createTaskBtn = document.querySelector('#create-task-btn');
  createTaskBtn.addEventListener('click', openTaskForm);
  taskForm.addEventListener(TaskForm.taskFormSubmitEvent, handleTaskFormSubmit);
  document.addEventListener(TaskItem.editTaskEvent, handleTaskEdit);
  document.addEventListener(TaskItem.deleteTaskEvent, handleTaskDelete);
  document.addEventListener(TaskItem.completeTaskEvent, handleTaskCompleted);

  filterMain();
}

/**
 * Redirect user to the login page
 */
function redirectToLogin() {
  window.location.href = '/login';
}

/**
 * Render the page with user data
 * @param { User } user user data from auth service
 */
async function renderPage(user) {
  console.log(user);
  renderTaskPanels(TaskStore.getAllTasks());
}

/**
 * A subscriber to authService to listen to any authentication changes
 * if signed in and user is valid, render the page
 * otherwise, redirect to login page
 * @param { string } event The new state of authentication
 * @param { User } user The user data passed from authService
 */
function authEventHandler(event, user) {
  if (event === 'SIGNED_IN' && user) {
    renderPage(authService.getGithubData());
  } else if (event === 'SIGNED_OUT' || !user) {
    redirectToLogin();
  }
}

/**
 * Open up the create task form for user to create a new task
 */
function openTaskForm() {
  /** @type { TaskForm } */
  const taskForm = document.querySelector('task-form');
  taskFormMode = 'create';
  taskForm.show();
}

/**
 * Convert form data to task format
 * @param { TaskFormData } formData The data from the form submission event
 * @returns { Omit<Task, 'id'> & { id?: string } } Formatted task data
 */
function formatTaskData(formData) {
  return {
    id: formData.id,
    title: formData.taskName,
    type: 'personal',
    done: false,
    priority: formData.priority,
    tags: formData.tags,
    dueDate: new Date(formData.dueDate),
    description: formData.description,
    url: '',
  };
}

/**
 * Handle the fired event when the user creates or edits a task
 * @param { CustomEvent } e The custom event object passed from task-form
 */
function handleTaskFormSubmit(e) {
  if (!taskFormMode)
    throw new Error(
      'Task form mode should not be null when the task form is submitted.'
    );

  const taskData = formatTaskData(e.detail);

  try {
    if (taskFormMode === 'create') {
      TaskStore.createTask(taskData);
      renderTaskPanels(TaskStore.getAllTasks());
    } else if (taskFormMode === 'edit') {
      const taskId = taskData.id;

      if (!taskId) throw new Error('Task ID is required for edit mode');

      console.log(taskData);
      const updates = {
        title: taskData.title,
        dueDate: taskData.dueDate,
        description: taskData.description,
        priority: taskData.priority,
        tags: taskData.tags,
        url: '', // TODO: Implement URL handling when necessary. Currently not used in the task data.
      };

      TaskStore.updateTask(Number(taskId), updates);
      renderTaskPanels(TaskStore.getAllTasks());
    }
  } catch (error) {
    console.error('Failed to process task:', error);
  }
}

/**
 * Handle the fired event when the user wants to edit a task
 * @param { CustomEvent } e The custom event object passed from task-item
 */
function handleTaskEdit(e) {
  /** @type { TaskForm } */
  const taskForm = document.querySelector('task-form');
  taskForm.fill({
    id: e.detail.id,
    taskName: e.detail.title,
    priority: e.detail.priority,
    tags: e.detail.tags,
    dueDate: e.detail.date,
    description: e.detail.description,
  });
  taskFormMode = 'edit';
  taskForm.show();
}

/**
 * Handle the fired event when the user wants to delete a task
 * @param { CustomEvent } e The custom event object passed from task-item
 */
function handleTaskDelete(e) {
  const taskId = e.detail.id;

  if (!taskId) throw new Error('Task ID is required for delete mode');

  TaskStore.deleteTask(Number(taskId));

  renderTaskPanels(TaskStore.getAllTasks());
}

/**
 * Handle the fired event when the user wants to mark a task as completed
 * @param { CustomEvent } e The custom event object passed from task-item
 */
function handleTaskCompleted(e) {
  const taskId = e.detail.id;

  if (!taskId) throw new Error('Task ID is required for completion mode');

  TaskStore.updateTask(Number(taskId), { done: true });
  renderTaskPanels(TaskStore.getAllTasks());
}
const STORAGE_KEY = 'byteboard_links';

/**
 * Helper function to get links from localStorage.
 * @returns {Array} The array of links stored in localStorage.
 */
function getAllLinks() {
  const linksJson = localStorage.getItem(STORAGE_KEY);
  return linksJson ? JSON.parse(linksJson) : [];
}

/**
 * Function to render links in the sidebar.
 * Updates the DOM with the list of links stored in localStorage.
 * @returns {void}
 */
function renderLinks() {
  const linkList = document.getElementById('link-list');
  const links = getAllLinks();
  const toggleDeleteBtn = document.getElementById('toggle-delete-btn');
  const isDeleteMode = toggleDeleteBtn.dataset.deleteMode === 'true'; // Track delete mode state
  linkList.innerHTML = ''; // Clear the current list

  links.forEach(link => {
    const li = document.createElement('li');
    li.classList.add('link-item');

    // Add icon if available
    if (link.iconUrl) {
      const iconImage = document.createElement('img');
      iconImage.src = link.iconUrl;
      iconImage.alt = 'Link Icon';
      iconImage.style.width = '24px'; // Set size for icon
      iconImage.style.height = '24px'; // Set size for icon
      li.appendChild(iconImage);
    }

    // Add link button
    const linkButton = document.createElement('button');
    linkButton.classList.add('link-button');
    linkButton.textContent = link.title;
    /**
     *
     */
    // Update this to handle 'www.' URLs properly
    linkButton.onclick = function () {
      let validUrl = link.url;
      // If the URL starts with 'www.', prepend 'http://'
      if (validUrl.startsWith('www.')) {
        validUrl = `http://${validUrl}`;
      }
      window.open(validUrl, '_blank');
    };

    // Add delete icon
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('delete-icon', 'fa-solid', 'fa-trash-can');
    deleteIcon.style.color = '#ef4444';
    deleteIcon.style.display = isDeleteMode ? 'inline' : 'none'; // Show based on delete mode
    deleteIcon.addEventListener('click', () => deleteLink(link.id));

    // Append elements to the list item
    li.appendChild(linkButton);
    li.appendChild(deleteIcon);
    linkList.appendChild(li);
  });
}

/**
 * Function to add a new link.
 *  Saves the new link to localStorage and re-renders the links list.
 * @returns {void} This function does not return any value.
 */
function addLink() {
  const titleInput = document.getElementById('link-title');
  const urlInput = document.getElementById('link-url');
  const iconUrlInput = document.getElementById('link-icon-url');
  const errorMessage = document.getElementById('url-error-message');

  if (titleInput instanceof HTMLInputElement && urlInput instanceof HTMLInputElement && iconUrlInput instanceof HTMLInputElement) {
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const iconUrl = iconUrlInput.value.trim();

    if (title != null && title.length == 0) {
      errorMessage.textContent = 'Invalid title name';
      errorMessage.style.display = 'block';
      titleInput.value = '';
      urlInput.value = '';
      iconUrlInput.value = '';
      return;
    }

    // Validate the URLs
    if (!isValidUrl(iconUrl) && iconUrl !== '') {
      errorMessage.textContent = 'Invalid icon URL!';
      errorMessage.style.display = 'block';
      titleInput.value = '';
      urlInput.value = '';
      iconUrlInput.value = '';
      return;
    }

    if (!isValidUrl(url)) {
      errorMessage.textContent = 'Invalid URL!';
      errorMessage.style.display = 'block';
      titleInput.value = '';
      urlInput.value = '';
      iconUrlInput.value = '';
      return;
    }

    errorMessage.style.display = 'none';

    // Format the URL before saving
    const formattedUrl = formatUrl(url);

    // Create a new link object
    const newLink = {
      id: Date.now(), // Unique ID based on timestamp
      title,
      url: formattedUrl,
      iconUrl: iconUrl || null,
    };

    const links = getAllLinks();
    links.push(newLink);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));

    // Clear the input fields
    titleInput.value = '';
    urlInput.value = '';
    iconUrlInput.value = '';

    renderLinks();

    // Hide the form after saving
    document.getElementById('add-link-form').style.display = 'none';
  } else {
    console.log('Invalid input fields. Please check and try again.');
  }
}

/**
 * Function to check if the URL is valid.
 * @param {string} url - The URL to validate.
 * @returns {boolean}
 */
function isValidUrl(url) {
  const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}(\S*)$/i;
  return urlPattern.test(url);
}

/**
 * Function to format a URL.
 * @param {string} url - The URL to format.
 * @returns {string}
 */
function formatUrl(url) {
  let formattedUrl = url.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }
  if (!formattedUrl.includes('www.')) {
    const urlParts = formattedUrl.split('://');
    formattedUrl = `${urlParts[0]}://www.${urlParts[1]}`;
  }
  return formattedUrl;
}

/**
 * Function to toggle delete mode.
 * Shows or hides the delete icons when the toggle-delete button is clicked.
 */
function toggleDeleteMode() {
  const toggleDeleteBtn = document.getElementById('toggle-delete-btn');
  const isDeleteMode = toggleDeleteBtn.dataset.deleteMode === 'true'; // Check current state

  // Toggle the state
  // Toggle the state
  toggleDeleteBtn.dataset.deleteMode = String(!isDeleteMode); // Convert to string

  // Re-render the links to update the visibility of delete icons
  renderLinks();
}

/**
 * Function to delete a link.
 * Removes the link from localStorage and re-renders the list of links.
 * @param {number} linkId - The ID of the link to be deleted.
 */
function deleteLink(linkId) {
  const links = getAllLinks();
  const filteredLinks = links.filter(link => link.id !== linkId);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLinks));
  renderLinks();
}

/**
 * Event listener for the "Add Link" button.
 */
document.getElementById('add-link-btn').addEventListener('click', () => {
  const addLinkForm = document.getElementById('add-link-form');
  addLinkForm.style.display = addLinkForm.style.display === 'block' ? 'none' : 'block';
});

/**
 * Event listener for the "Close" button in the form.
 */
document.getElementById('close-popup-btn').addEventListener('click', () => {
  document.getElementById('add-link-form').style.display = 'none';
});

/**
 * Event listener for clicks outside of the
 *  * "Add Link" form.
 * Closes the form if the user clicks outside of it.
 */
window.addEventListener('click', (e) => {
  const modal = document.getElementById('add-link-form');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

/**
 * Event listener for the "Save Link" button.
 */
document.getElementById('save-link-btn').addEventListener('click', addLink);

/**
 * Event listener for the "Toggle Delete" button.
 */
document.getElementById('toggle-delete-btn').addEventListener('click', toggleDeleteMode);

/**
 * Initial render of the links on page load.
 */
document.addEventListener('DOMContentLoaded', renderLinks);
