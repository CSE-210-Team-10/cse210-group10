import { authService } from '../js/auth.js';
import { standardizeString } from '../js/library.js';

/** @typedef { import('../js/auth.js').UserData } User */

console.log(standardizeString('test'));
authService.subscribeToAuthChanges(authEventHandler);
let token = '';

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
  token = user.accessToken;
  console.log(token);
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

//Constant variables just for proof of concept, remove when deploying/releasing 
const owner = 'CSE-210-Team-10';
const repo = 'group10-esc012';

/**
 * Fetch pull request data from specified paramters.
 * @param { string } token The SSO token generated
 * @param { string } owner The owner of the repo
 * @param { string } repo The repo that the user wants to pull from
 */
async function getPullRequests(token, owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch pull requests.');
    }

    const data = await response.json();
    return data;

  }
  catch (error) {
    console.log(error);
  }
};

/**
 * Fetch issue data from specified paramters.
 * @param { string } token The SSO token generated
 * @param { string } owner The owner of the repo
 * @param { string } repo The repo that the user wants to pull from
 */
async function getIssues(token, owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch issues.');
    }

    const data = await response.json();
    return data;

  }
  catch (error) {
    console.log(error);
  }
};

//Test if we are actually getting the data, remove when deploy
const data = await getIssues(token, owner, repo);
console.log(data);