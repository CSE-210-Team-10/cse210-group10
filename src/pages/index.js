import { authService } from '../js/auth.js';
import { standardizeString } from '../js/library.js';

/** @typedef { import('../js/auth.js').UserData } User */

/**
 * Check if the user is authenticated when they land on the page.
 * If not, redirect them to the home page
 * If so, render the page with user data
 */
async function initAuth() {
  const user = await authService.init();

  if (user === null) {
    redirectToLogin();
  } else {
    renderPage(authService.getGithubData());
  }
}

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
function renderPage(user) {
  console.log(user);
}

console.log(standardizeString('test'));
initAuth();
