import { getAllTasks } from './crud.js';

/**
 * @typedef { object } TaskFilters
 * @property { string } [title] - Search text for title
 * @property { boolean } [done] - Completion status
 * @property { Date } [beforeDate] - Filter tasks due before this date
 * @property { Date } [afterDate] - Filter tasks due after this date
 * @property { string[] } [tags] - Tags to search for
 */

/** @typedef { import('./index.js').Task } Task */

/**
 * Filter tasks by title (case-insensitive)
 * @param { string } searchText
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByTitle(searchText, tasks = getAllTasks()) {
  if (!searchText) return tasks;
  return tasks.filter(task =>
    task.title.toLowerCase().includes(searchText.toLowerCase())
  );
}

/**
 * Filter tasks by completion status
 * @param { boolean } isDone
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByStatus(isDone, tasks = getAllTasks()) {
  return tasks.filter(task => task.done === isDone);
}

/**
 * Filter tasks by tags (matches any tag in the input array)
 * @param { string[] } searchTags
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByTags(searchTags, tasks = getAllTasks()) {
  if (!searchTags?.length) return tasks;
  return tasks.filter(task =>
    task.tags.some(tag =>
      searchTags.some(searchTag =>
        tag.toLowerCase().includes(searchTag.toLowerCase())
      )
    )
  );
}

/**
 * Filter tasks by date range
 * @param {{ beforeDate?: Date, afterDate?: Date }} dateFilters
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByDateRange(dateFilters, tasks = getAllTasks()) {
  if (!dateFilters.beforeDate && !dateFilters.afterDate) {
    throw new Error('At least one of beforeDate or afterDate must be provided');
  }

  return tasks.filter(task => {
    if (dateFilters.beforeDate && task.dueDate > dateFilters.beforeDate) {
      return false;
    }
    if (dateFilters.afterDate && task.dueDate < dateFilters.afterDate) {
      return false;
    }
    return true;
  });
}

/**
 * Filter tasks based on provided criteria
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @param { TaskFilters } [filters={}]
 * @returns { Task[] }
 */
function filterTasks(tasks = getAllTasks(), filters = {}) {
  let result = tasks;

  if (filters.title) {
    result = filterByTitle(filters.title, result);
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

  if (filters.tags?.length) {
    result = filterByTags(filters.tags, result);
  }

  return result;
}

export { filterTasks };
