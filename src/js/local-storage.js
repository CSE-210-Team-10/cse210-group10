import { PROVIDER_TOKEN_KEY, THEME_KEY, GITHUB_TASKS_KEY } from './const.js';
import { getTasksByUser, isProviderTokenValid } from './github-api.js';

/** @typedef { import('./auth.js').UserData } User */
/** @typedef { import('./task/index.js').Task } Task */

/**
 * Validates and sets the provider token in localStorage
 * @param { string } token - The provider token to validate and store
 * @returns { Promise<boolean> } - Returns true if token is valid and was set, false otherwise
 * @private
 */
export async function setProviderToken(token) {
  try {
    if (!token) return false;

    const isTokenValid = await isProviderTokenValid(token);
    console.log(isTokenValid);
    if (!isTokenValid) return false;

    localStorage.setItem(PROVIDER_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error setting provider token:', error);
    return false;
  }
}

/**
 * Remove Provider Token from localStorage
 */
export function removeProviderToken() {
  localStorage.removeItem(PROVIDER_TOKEN_KEY);
}

/**
 * Get Provider Token from localStorage
 * @returns { string } Provider Token from localStorage
 */
export function getProviderToken() {
  return localStorage.getItem(PROVIDER_TOKEN_KEY);
}

/**
 * Set theme to localStorage
 * @param { 'light' | 'dark' } theme theme of the application
 */
export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Get theme from localStorage
 * @returns { 'light' | 'dark' } theme of the application
 */
export function getTheme() {
  const theme = localStorage.getItem(THEME_KEY);

  if (theme === 'light' || theme === 'dark') return theme;
  return 'light';
}

/**
 * Refresh GitHub Tasks for the user
 * @param { User } user to fetch tasks for
 */
export async function refreshGithubTasks(user) {
  const tasks = await getTasksByUser(user);
  localStorage.setItem(GITHUB_TASKS_KEY, JSON.stringify(tasks));
}

/**
 * Get GitHub Tasks for the user
 * @returns { Task[] } list of GitHub tasks
 */
export function getGithubTasks() {
  return JSON.parse(localStorage.getItem(GITHUB_TASKS_KEY));
}
