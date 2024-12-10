/** @typedef { import('../js/task/index.js').Task } Task */

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
export function renderTaskPanels(tasks) {
  const personalTasksList = document.querySelector(
    '#personal-task-panel .tasks'
  );

  personalTasksList.innerHTML = '';

  // Sort tasks into appropriate lists
  tasks.forEach(task => {
    if (task.done) return;

    const taskElement = createTaskElement(task, true);

    // Determine which list to add the task to
    if (task.type === 'personal') {
      personalTasksList.appendChild(taskElement);
    } else if (task.type === 'issue' || task.type === 'pr') {
      // githubTasksList.appendChild(taskElement);
    }
  });
}
