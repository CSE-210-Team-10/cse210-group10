import { FilterForm } from '../components/filter-form/index.js';
import TaskFilter from '../js/task/filter.js';

import { renderTaskPanels } from './render.js';

/** @typedef { import('../components/filter-form').FilterData } FilterData */
/** @typedef { import('../js/task/filter').TaskFilters } TaskFilters */

/**
 *
 */
export function main() {
  /** @type { FilterForm } */
  const filterForm = document.querySelector('filter-form');
  const filterBtn = document.querySelector('#tasks-filters button');

  filterBtn.addEventListener('click', openFilterForm);

  filterForm.addEventListener(
    FilterForm.filterFormSubmitEvent,
    handleFilterFormSubmit
  );
}

/**
 * Handle the fired event when the user applies the filter
 * @param { CustomEvent } e The custom event object passed from filter-form
 */
function handleFilterFormSubmit(e) {
  /** @type { FilterData } */
  const filtersData = e.detail;

  /** @type { TaskFilters } */
  const filters = { done: false };

  if (filtersData.github.length) filters.tags = filtersData.github;
  if (filtersData.priority.length) filters.priorities = filtersData.priority;
  filters.dateSort = filtersData.dateSort;

  const filteredTasks = TaskFilter.filterTasks(filters);
  renderTaskPanels(filteredTasks);
}

/**
 * Open up the create task form for user to create a new task
 */
function openFilterForm() {
  /** @type { FilterForm } */
  const filterForm = document.querySelector('filter-form');
  filterForm.show();
}
