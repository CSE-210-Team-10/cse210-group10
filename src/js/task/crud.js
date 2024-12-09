/** @typedef { import('./index.js').Task } Task */

const STORAGE_KEY = 'byteboard_tasks';

/**
 * Get the maximum ID from existing tasks
 * @param { Task[] } tasks Task list to find the maximum ID from
 * @returns { number }
 */
function getMaxId(tasks) {
  if (tasks.length === 0) return 0;
  return Math.max(...tasks.map(task => task.id));
}

/**
 * Validates a task object has all required properties with correct types
 * @param { Task } task The task to be validated
 * @throws { Error } If task is invalid
 */
function validateTask(task) {
  if (!task.title || typeof task.title !== 'string') {
    throw new Error('Task must have a valid title');
  }

  if (!['issue', 'pr', 'personal'].includes(task.type)) {
    throw new Error('Task must have a valid type: issue, pr, or personal');
  }

  if (typeof task.done !== 'boolean') {
    throw new Error('Task must have a valid done status');
  }

  if (!(task.dueDate instanceof Date) || isNaN(task.dueDate.getTime())) {
    throw new Error('Task must have a valid due date');
  }

  if (!Array.isArray(task.tags)) {
    throw new Error('Task must have a valid tags array');
  }

  if (!['high', 'medium', 'low'].includes(task.priority)) {
    throw new Error('Task must have a valid priority: high, medium, or low');
  }
}

/**
 * Create a new task
 * @param { Omit<Task, 'id'> } taskData - Task data without ID
 * @returns { Task } The created task with generated ID
 */
function createTask(taskData) {
  const tasks = getAllTasks();

  // Generate new ID by incrementing max ID
  const newTask = {
    ...taskData,
    id: getMaxId(tasks) + 1,
    dueDate: new Date(taskData.dueDate), // Ensure dueDate is Date object
    tags: taskData.tags || [], // Ensure tags exists
    priority: taskData.priority, // Default to medium priority if not specified
  };

  validateTask(newTask);

  tasks.push(newTask);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return newTask;
}

/**
 * Get all tasks
 * @returns { Task[] } Array of all tasks with parsed dates
 */
function getAllTasks() {
  const tasksJson = localStorage.getItem(STORAGE_KEY);
  const tasks = tasksJson ? JSON.parse(tasksJson) : [];

  // Convert date strings back to Date objects
  return tasks.map(task => ({
    ...task,
    dueDate: new Date(task.dueDate),
  }));
}

/**
 * Get a single task by ID
 * @param { number } id The ID of the task to retrieve
 * @returns { Task | undefined }
 */
function getTask(id) {
  return getAllTasks().find(task => task.id === id);
}

/**
 * Update an existing task
 * @param { number } id The ID of the task to update
 * @param { Partial<Omit<Task, 'id'>> } updates The updates to be made to the task with the given ID
 * @returns { Task | undefined } The updated task or undefined if not found
 */
function updateTask(id, updates) {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return undefined;
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    // Ensure dueDate remains a Date object if it was updated
    dueDate: updates.dueDate
      ? new Date(updates.dueDate)
      : tasks[taskIndex].dueDate,
  };

  validateTask(updatedTask);
  tasks[taskIndex] = updatedTask;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

  return updatedTask;
}

/**
 * Delete a task
 * @param { number } id The ID of the task to delete
 * @returns { boolean } Whether the task was deleted
 */
function deleteTask(id) {
  const tasks = getAllTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);

  if (filteredTasks.length === tasks.length) {
    return false;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
  return true;
}

export { createTask, getTask, getAllTasks, updateTask, deleteTask };
export default { createTask, getTask, getAllTasks, updateTask, deleteTask };
