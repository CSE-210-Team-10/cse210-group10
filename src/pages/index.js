import { authService } from '../js/auth.js';
import { standardizeString } from '../js/library.js';
import { TaskItem } from '../components/task-item/index.js';
import { TaskForm } from '../components/task-form/index.js';

/** @typedef { import('../js/auth.js').UserData } User */

console.log(standardizeString('test'));

/** @type { TaskForm } */
const taskForm = document.querySelector('task-form');
const createTaskBtn = document.querySelector('#create-task-btn');
createTaskBtn.addEventListener('click', openTaskForm);
taskForm.addEventListener(TaskForm.taskFormSubmitEvent, handleTaskFormSubmit);
document.addEventListener(TaskItem.editTaskEvent, handleTaskEdit);
document.addEventListener(TaskItem.deleteTaskEvent, handleTaskDelete);
document.addEventListener(TaskItem.completeTaskEvent, handleTaskCompleted);
authService.subscribeToAuthChanges(authEventHandler);

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
  taskForm.show();
}

/**
 * Handle the fired event when the user creates a new task
 * @param { CustomEvent } e The custom event object passed from task-form
 */
function handleTaskFormSubmit(e) {
  console.log(e.detail);
}

/**
 * Handle the fired event when the user wants to edit a task
 * @param { CustomEvent } e The custom event object passed from task-item
 */
function handleTaskEdit(e) {
  console.log(e.detail);
}

/**
 * Handle the fired event when the user wants to delete a task
 * @param { CustomEvent } e The custom event object passed from task-item
 */
function handleTaskDelete(e) {
  console.log(e.detail);
}

/**
 * Handle the fired event when the user wants to mark a task as completed
 * @param { CustomEvent } e The custom event object passed from task-item
 */
function handleTaskCompleted(e) {
  console.log(e.detail);
}
