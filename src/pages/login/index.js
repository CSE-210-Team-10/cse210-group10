import { authService } from '../../js/auth.js';

/** @typedef { import('../../js/auth.js').UserData } User */

const loginButton = document.getElementById('loginButton');
const statusMessage = document.getElementById('statusMessage');

loginButton.addEventListener('click', loginButtonClickHandler);
authService.subscribeToAuthChanges(authEventHandler);

/**
 * Start authentication flow after login button is clicked
 */
async function loginButtonClickHandler() {
  try {
    statusMessage.textContent = 'Connecting to GitHub...';
    await authService.login();
  } catch (error) {
    console.error('Login failed:', error);
    statusMessage.textContent = 'Login failed. Please try again.';
  }
}

/**
 * A subscriber to authService to listen to any authentication changes
 * @param { string } event The new state of authentication
 * @param { User } user The user data passed from authService
 */
function authEventHandler(event, user) {
  if (event === 'SIGNED_IN' && user) {
    renderSignedIn(user.username);
  } else if (event === 'SIGNED_OUT' || !user) {
    renderSignedOut();
  }
}

/**
 * Render the login page when user is signed in with username
 * @param { string } username User's username
 */
function renderSignedIn(username) {
  statusMessage.textContent = `Welcome, ${username}!`;
  loginButton.textContent = 'Continue to App';
  window.location.href = '/';
}

/**
 * Render the login page when user is signed out
 */
function renderSignedOut() {
  statusMessage.textContent = 'Please log in to continue';
  loginButton.textContent = 'Continue with GitHub';
}
