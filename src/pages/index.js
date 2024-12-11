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
/****link****/
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
 * This updates the DOM with the list of links stored in localStorage.
 * 
 * @function
 * @returns {void} This function does not return any value.
 */
function renderLinks() {
  const linkList = document.getElementById('link-list');
  const links = getAllLinks();
  linkList.innerHTML = ''; // Clear the current list

  links.forEach(link => {
    const li = document.createElement('li');
    li.classList.add('link-item');

    const linkButton = document.createElement('button');
    linkButton.classList.add('link-button');
    linkButton.textContent = link.title;
    linkButton.onclick = function () {
      window.open(link.url, '_blank');
    };

    // Create the delete icon (hidden initially)
    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.textContent = '❌';
    deleteIcon.style.display = 'none'; // Hide delete icon by default
    deleteIcon.addEventListener('click', () => deleteLink(link.id));

    // Append elements to the list item
    li.appendChild(linkButton);
    li.appendChild(deleteIcon);

    linkList.appendChild(li); // Add each link with the delete button
  });
}

/**
 * Function to add a new link to the list.
 * Saves the new link to localStorage and re-renders the links list.
 * @function
 * @returns {void} 
 */
function addLink() {
  const titleInput = document.getElementById('link-title');
  const urlInput = document.getElementById('link-url');

  if (titleInput instanceof HTMLInputElement && urlInput instanceof HTMLInputElement) {
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const links = getAllLinks();
    const newLink = {
      id: Date.now(), // Unique ID based on timestamp
      title: title,
      url: url,
    };

    links.push(newLink);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));

    // Clear the input fields
    titleInput.value = '';
    urlInput.value = '';

    renderLinks(); // Re-render the list after adding a new link

    // Hide the input fields after saving
    document.getElementById('add-link-form').style.display = 'none';
  } else {
    // Use console.log instead of alert for better UX
    console.log('Please enter both title and URL');
  }
}

/**
 * Function to toggle the visibility of delete icons in the sidebar.
 * Shows or hides the delete icons for all links.
 * @function
 * @returns {void} 
 */
function toggleDeleteMode() {
  const deleteIcons = document.querySelectorAll('.delete-icon');

  deleteIcons.forEach(icon => {
    // Ensure that 'icon' is an HTMLElement
    if (icon instanceof HTMLElement) {
      if (icon.style.display === 'none' || icon.style.display === '') {
        icon.style.display = 'inline';
      } else {
        icon.style.display = 'none';
      }
    }
  });
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
  renderLinks(); // Re-render after deletion
}

/**
 * Event listener for the "Add Link" button.
 * Toggles the visibility of the "Add Link" form when clicked.
 */
document.getElementById('add-link-btn').addEventListener('click', () => {
  const addLinkForm = document.getElementById('add-link-form');

  // Toggle the form visibility
  if (addLinkForm.style.display === 'none' || addLinkForm.style.display === '') {
    addLinkForm.style.display = 'block';
  } else {
    addLinkForm.style.display = 'none';
  }
});

/**
 * Event listener for the "Close" button inside the "Add Link" form.
 * Hides the "Add Link" form when clicked.
 */
document.getElementById('close-popup-btn').addEventListener('click', () => {
  document.getElementById('add-link-form').style.display = 'none';
});
/**
 * Event listener for clicks outside of the "Add Link" form.
 * Closes the form if the user clicks outside of the modal.
 */
window.addEventListener('click', (e) => {
  const modal = document.getElementById('add-link-form');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
/**
 * Event listener for the "Save Link" button.
 * Triggers the addLink function when the button is clicked.
 */
document.getElementById('save-link-btn').addEventListener('click', addLink);

/**
 * Event listener for the "Toggle Delete" button.
 * Toggles the delete icons visibility when clicked.
 */
document.getElementById('toggle-delete-btn').addEventListener('click', toggleDeleteMode);

/**
 * Initial render of the links when the page loads.
 * This ensures that the list of links is populated from localStorage on page load.
 */
document.addEventListener('DOMContentLoaded', renderLinks);
