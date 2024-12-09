import { FilterForm } from '../components/filter-form/index.js';

import {
  getCurrentFilter,
  updateCurrentFilter as updateFilter,
} from './filters-state.js';

/** @typedef { import('../components/filter-form').FilterData } FilterData */
/** @typedef { import('../js/task/filter').TaskFilters } TaskFilters */

/**
 *
 */
export function main() {
  /** @type { FilterForm } */
  const filterForm = document.querySelector('filter-form');
  const filterBtn = document.querySelector('#tasks-filters button');
  const searchInput = document.querySelector('#tasks-filters input');

  filterBtn.addEventListener('click', openFilterForm);
  searchInput.addEventListener('keydown', handleSearch);

  filterForm.addEventListener(
    FilterForm.filterFormSubmitEvent,
    handleFilterFormSubmit
  );
}

/**
 * Handle search input events
 * @param { KeyboardEvent } e The keyboard event
 */
function handleSearch(e) {
  /** @type { HTMLInputElement } */
  const searchInput = document.querySelector('#tasks-filters input');

  if (e.key === 'Enter') {
    updateFilter({ text: searchInput.value });
  }
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

  filters.tags = filtersData.github;
  filters.priorities = filtersData.priority;
  filters.dateSort = filtersData.dateSort;

  updateFilter(filters);
}

/**
 * Open up the create task form for user to create a new task
 */
function openFilterForm() {
  /** @type { FilterForm } */
  const filterForm = document.querySelector('filter-form');

  const currentFilters = getCurrentFilter();

  /** @type {Array<'issue' | 'pr'>} */
  const github = currentFilters.tags.filter(
    tag => tag === 'issue' || tag === 'pr'
  );

  /** @type { FilterData } */
  const filterData = {
    priority: currentFilters.priorities,
    github,
    dateSort: currentFilters.dateSort,
  };

  filterForm.fill(filterData);
  filterForm.show();
}
