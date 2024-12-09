/**
 * Filter an array of tasks based on their type.
 *
 * @param {Array} tasks - The array of tasks to be filtered.
 * @param {string} type - The type to filter by.
 * @returns {Array} The filtered array of tasks.
 */
function filterTasksByType(tasks, type) {
  return tasks.filter(task => task.type === type);
}

/**
 * Filter an array of tasks based on their status.
 *
 * @param {Array} tasks - The array of tasks to be filtered.
 * @param {string} status - The status to filter by.
 * @returns {Array} The filtered array of tasks.
 */
function filterTasksByStatus(tasks, status) {
  return tasks.filter(task => task.status === status);
}

/**
 * Filter an array of tasks based on their creation time.
 * 
 * @param {Array} tasks - The array of tasks to be filtered.
 * @param {string} creationTime - The creation time to filter by.
 * @param {string} operator - The comparison operator ('before', 'after', 'on')
 * @returns {Array} Filtered tasks
 */
function filterTasksByCreationTime(tasks, creationTime, operator = 'on') {
  const compareDate = new Date(creationTime).getTime();

  return tasks.filter(task => {
    const taskDate = new Date(task.createdAt).getTime();

    switch (operator) {
    case 'before':
      return taskDate < compareDate;
    case 'after':
      return taskDate > compareDate;
    case 'on': {
    // Compare the date only, not the time
      const taskDay = new Date(task.createdAt).toDateString();
      const compareDay = new Date(creationTime).toDateString();
      return taskDay === compareDay; 
    }
    default:
      return true;
    }
  });
}

/**
 * Sort tasks by creation time from latest to earliest
 * 
 * @param {Array} tasks - The array of tasks to be sorted
 * @returns {Array} Sorted tasks
 */
function sortTasksFromLatest(tasks) {
  return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Sort tasks by creation time from earliest to latest
 * @param {Array} tasks - The array of tasks to be sorted
 * @returns {Array} Sorted tasks
 */
function sortTasksFromEarliest(tasks) {
  return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export { filterTasksByType, filterTasksByStatus, filterTasksByCreationTime, sortTasksFromLatest, sortTasksFromEarliest };