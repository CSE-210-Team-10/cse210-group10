import { authService } from '../js/auth.js';
import { TaskItem } from '../components/task-item/index.js';
import { TaskForm } from '../components/task-form/index.js';
import TaskStore from '../js/task/crud.js';

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
  console.log(e.detail);
}

/**
 * Handle the fired event when the user wants to mark a task as completed
 * @param { CustomEvent } e The custom event object passed from task-item
 */
function handleTaskCompleted(e) {
  console.log(e.detail);
}

/**
 * Creates a task-item element with the given task data
 * @param { Task } task - The task data to create an element for
 * @param { boolean } interactive - Whether this task is interactive
 * @returns { HTMLElement } The created task-item element
 */
function createTaskElement(task, interactive) {
  const li = document.createElement('li');
  const taskItem = document.createElement('task-item');

  // Set the data attributes
  taskItem.dataset.id = String(task.id);
  taskItem.dataset.title = task.title;
  taskItem.dataset.priority = task.priority;
  taskItem.dataset.tags = JSON.stringify(task.tags);
  taskItem.dataset.date = task.dueDate.toLocaleDateString();
  if (interactive) taskItem.setAttribute('interactive', '');

  // Set the description as the content
  taskItem.textContent = task.description;

  li.appendChild(taskItem);
  return li;
}

/**
 * Populate tasks on view based on the type of the task
 * If a task is type "issue" or "PR", then populate it on GitHub Tasks
 * If a task is type "personal" then populate it on Personal Tasks
 * @param { Task[] } tasks a list of tasks to populate
 */
function renderTaskPanels(tasks) {
  const personalTasksList = document.querySelector(
    '#personal-task-panel .tasks'
  );

  personalTasksList.innerHTML = '';

  // Sort tasks into appropriate lists
  tasks.forEach(task => {
    const taskElement = createTaskElement(task, true);

    // Determine which list to add the task to
    if (task.type === 'personal') {
      personalTasksList.appendChild(taskElement);
    } else if (task.type === 'issue' || task.type === 'pr') {
      // githubTasksList.appendChild(taskElement);
    }
  });
}
