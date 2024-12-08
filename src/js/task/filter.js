import { getAllTasks } from './crud.js';

/**
 * @typedef { object } TaskFilters
 * @property { string } [text] - Search text for title/tags
 * @property { boolean } [done] - Completion status
 * @property { Date } [beforeDate] - Filter tasks due before this date
 * @property { Date } [afterDate] - Filter tasks due after this date
 */

/** @typedef { import('./index.js').Task } Task */

/**
 * Filter tasks by title (case-insensitive)
 * @param { string } text - Text to search for
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByTitle(text, tasks = getAllTasks()) {
  if (!text) return tasks;
  return tasks.filter(task =>
    task.title.toLowerCase().includes(text.toLowerCase())
  );
}

/**
 * Filter tasks by completion status
 * @param { boolean } status - Status to search for
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByStatus(status, tasks = getAllTasks()) {
  return tasks.filter(task => task.done === status);
}

/**
 * Filter tasks by tags (matches any tag in the input array)
 * @param { string } text - Tags to search for
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByTags(text, tasks = getAllTasks()) {
  if (!text) return tasks;
  return tasks.filter(task =>
    task.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()))
  );
}

/**
 * Filter tasks by date range
 * @param {{ beforeDate?: Date, afterDate?: Date }} dateFilters - Date range to search for
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByDateRange(dateFilters, tasks = getAllTasks()) {
  if (!dateFilters.beforeDate && !dateFilters.afterDate) {
    throw new Error('At least one of beforeDate or afterDate must be provided');
  }

  if (dateFilters.beforeDate && !(dateFilters.beforeDate instanceof Date)) {
    throw new Error('beforeDate must be a valid Date object');
  }

  if (dateFilters.afterDate && !(dateFilters.afterDate instanceof Date)) {
    throw new Error('afterDate must be a valid Date object');
  }

  return tasks.filter(task => {
    const isAfterEndDate =
      dateFilters.beforeDate && task.dueDate > dateFilters.beforeDate;

    const isBeforeStartDate =
      dateFilters.afterDate && task.dueDate < dateFilters.afterDate;

    return !isAfterEndDate && !isBeforeStartDate;
  });
}

/**
 * Filter tasks based on provided criteria
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @param { TaskFilters } [filters={}] - Filters to apply to the filtering process
 * @returns { Task[] }
 */
function filterTasks(tasks = getAllTasks(), filters = {}) {
  let result = tasks;

  if (filters.text) {
    result = filterByTitle(filters.text, result);
    result = filterByTags(filters.text, result);
  }

  if (filters.done !== undefined) {
    result = filterByStatus(filters.done, result);
  }

  if (filters.beforeDate || filters.afterDate) {
    result = filterByDateRange(
      {
        beforeDate: filters.beforeDate,
        afterDate: filters.afterDate,
      },
      result
    );
  }

  return result;
}

export { filterTasks };
