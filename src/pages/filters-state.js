import TaskFilter from '../js/task/filter.js';

import { renderTaskPanels } from './render.js';

/** @typedef { import('../js/task/filter').TaskFilters } TaskFilters */
/** @typedef { import('../components/filter-form').FilterData } FilterData */
/** @typedef { TaskFilters } FilterState */

/** @type { FilterState } */
let currentFilter = { tags: [], priorities: [], dateSort: 'desc', done: false };

/**
 * Updates the current filter
 * @param { Partial<FilterState> } updates Updates to the current filter
 */
export function updateCurrentFilter(updates) {
  currentFilter = {
    ...currentFilter,
    ...updates,
  };

  const filteredTasks = TaskFilter.filterTasks(currentFilter);
  renderTaskPanels(filteredTasks);
}

/**
 * Gets a copy of the current filter
 * @returns { FilterState}
 */
export function getCurrentFilter() {
  return { ...currentFilter };
}
