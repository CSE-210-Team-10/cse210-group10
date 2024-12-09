import { authService } from '../js/auth.js';
import { standardizeString } from '../js/library.js';
import { TaskItem } from '../components/task-item/index.js';

/** @typedef { import('../js/auth.js').UserData } User */

const darkModeToggle = document.querySelector('button:has(i.fa-moon)');
const lightModeToggle = document.querySelector('button:has(i.fa-sun)');

console.log(TaskItem.name);
console.log(standardizeString('test'));
authService.subscribeToAuthChanges(authEventHandler);

/**
 * Redirect user to the login page
 */
function redirectToLogin() {
  window.location.href = '/login';
}

/**
 * Render the page with user data
 * @param { User } user user data from auth service
 */
async function renderPage(user) {
  console.log(user);
}

/**
 * A subscriber to authService to listen to any authentication changes
 * if signed in and user is valid, render the page
 * otherwise, redirect to login page
 * @param { string } event The new state of authentication
 * @param { User } user The user data passed from authService
 */
function authEventHandler(event, user) {
  if (event === 'SIGNED_IN' && user) {
    renderPage(authService.getGithubData());
  } else if (event === 'SIGNED_OUT' || !user) {
    redirectToLogin();
  }
}

darkModeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-mode');
  darkModeToggle.ariaDisabled = 'true';
  darkModeToggle.disabled = true;
  lightModeToggle.ariaDisabled = 'false';
  lightModeToggle.disabled = false;
});

lightModeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-mode');
  darkModeToggle.ariaDisabled = 'false';
  darkModeToggle.disabled = false;
  lightModeToggle.ariaDisabled = 'true';
  lightModeToggle.disabled = true;
});