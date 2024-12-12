import { getAllTasks } from './crud.js';

/**
 * @typedef { object } TaskFilters
 * @property { string } [text] - Search text for title/tags
 * @property { boolean } [done] - Completion status
 * @property { Date } [beforeDate] - Filter tasks due before this date
 * @property { Date } [afterDate] - Filter tasks due after this date
 * @property { Array<'high' | 'medium' | 'low'> } [priorities] - Filter tasks by priority levels
 * @property { string[] } [tags] - Filter tasks by tags
 * @property { 'asc' | 'desc' } [dateSort='desc'] - Sort direction for dates
 */

/** @typedef { import('./index.js').Task } Task */

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
 * Filter tasks by text matching in title or tags
 * @param { string } text - Text to search for in titles and tags
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByText(text, tasks = getAllTasks()) {
  if (!text) return tasks;
  const searchText = text.toLowerCase();

  return tasks.filter(
    task =>
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.tags.some(tag =>
        tag.toLowerCase().includes(searchText.toLowerCase())
      ) ||
      task.priority.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase())
  );
}

/**
 * Filter tasks by specific tags (matches any tag in the input array)
 * @param { string[] } tags - Array of tags to filter by
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByTags(tags, tasks = getAllTasks()) {
  if (!tags.length) return tasks;
  return tasks.filter(task =>
    task.tags.some(taskTag => tags.includes(taskTag.toLowerCase()))
  );
}

/**
 * Filter tasks by multiple priorities
 * @param { Array<'high' | 'medium' | 'low'> } priorities - Priority levels to filter by
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByPriorities(priorities, tasks = getAllTasks()) {
  if (!priorities.length) return tasks;
  return tasks.filter(task => priorities.includes(task.priority));
}

/**
 * Sort tasks by due date
 * @param { 'asc' | 'desc' } direction - Sort direction ('asc' for ascending, 'desc' for descending)
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to sort
 * @returns { Task[] }
 */
function sortByDate(direction, tasks = getAllTasks()) {
  return [...tasks].sort((a, b) => {
    const comparison = a.dueDate.getTime() - b.dueDate.getTime();
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Filter tasks by date range
 * @param {{ beforeDate?: Date, afterDate?: Date }} dateFilters - Date range to search for
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterByDateRange(dateFilters, tasks = getAllTasks()) {
  if (!dateFilters.beforeDate && !dateFilters.afterDate) {
    console.log(tasks);
    return tasks;
  }

  if (dateFilters.beforeDate && !(dateFilters.beforeDate instanceof Date)) {
    throw new Error('beforeDate must be a valid Date object');
  }

  if (dateFilters.afterDate && !(dateFilters.afterDate instanceof Date)) {
    throw new Error('afterDate must be a valid Date object');
  }

  return tasks.filter(task => {
    const isBeforeEndDate =
      !dateFilters.beforeDate || task.dueDate <= dateFilters.beforeDate;

    const isAfterStartDate =
      !dateFilters.afterDate || task.dueDate >= dateFilters.afterDate;

    return isBeforeEndDate && isAfterStartDate;
  });
}

/**
 * Filter tasks based on provided criteria
 * @param { TaskFilters } [filters={}] - Filters to apply to the filtering process
 * @param { Task[] } [tasks=getAllTasks()] - List of tasks to filter
 * @returns { Task[] }
 */
function filterTasks(filters = {}, tasks = getAllTasks()) {
  let result = tasks;

  if (filters.text) {
    result = filterByText(filters.text, result);
  }

  if (filters.tags?.length) {
    result = filterByTags(filters.tags, result);
  }

  if (filters.done !== undefined) {
    result = filterByStatus(filters.done, result);
  }

  if (filters.priorities?.length) {
    result = filterByPriorities(filters.priorities, result);
  }

  console.log(`result: ${JSON.stringify(result)}`);

  result = filterByDateRange(
    {
      beforeDate: filters.beforeDate,
      afterDate: filters.afterDate,
    },
    result
  );

  console.log(`result: ${JSON.stringify(result)}`);

  if (filters.dateSort) {
    result = sortByDate(filters.dateSort, result);
  } else {
    result = sortByDate('desc', result);
  }

  return result;
}

export default {
  filterByStatus,
  filterByTags,
  filterByPriorities,
  filterByDateRange,
  filterByText,
  sortByDate,
  filterTasks,
};
