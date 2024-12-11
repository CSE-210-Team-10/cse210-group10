/** @typedef { import('../js/auth.js').UserData } User */
/**
 * Verify if the GitHub provider token is still valid
 * @param { string } token github provider token
 * @returns { Promise<boolean> } whether the token is valid
 */
export async function isProviderTokenValid(token) {
  if (!token) return false;

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    console.log(response.status);
    return response.status === 200;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
}

/**
 * Helper function to parse the assignees list into list of login usernames.
 * @param { object[] } assignees The list of assignees
 * @returns { string[] } returns the list of assignee login usernames
 */
function parseAssigneesLogin(assignees) {
  const loginList = [];
  for (let j = 0; j < assignees.length; j++) {
    loginList.push(assignees[j].login);
  }
  return loginList;
}

/**
 * Fetch pull request data from specified parameters.
 * @param { User } user The user data object
 * @param { string } owner The owner of the repo
 * @param { string } repo The repo that the user wants to pull from
 * @returns { Promise<object[]> } returns the pull requests data task object format
 */
export async function getPullRequests(user, owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `${user.accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch pull requests.');
    }

    const data = await response.json();

    const arrayPulls = [];

    //Create task object from fetched data and populate array to return - return pull requests
    for (let i = 0; i < data.length; i ++) {
      const assignees = parseAssigneesLogin(data[i].assignees);
      if (assignees.includes(user.username)) {
        const parsedTask = {
          type: 'pr',
          title: String(data[i].title),
          done: false,
          dueDate: data[i].created_at instanceof Date 
            ? data[i].created_at 
            : new Date(data[i].created_at ),
          description: String(''),
          url: String(data[i].html_url),
          priority: String('high'),
          tags: [owner, repo]
        };
        arrayPulls.push(parsedTask);
      }
    }
    return arrayPulls;
  }
  catch (error) {
    console.error(error);
  }
}

/**
 * Fetch issue data from specified parameters.
 * @param { User } user The user data object
 * @param { string } owner The owner of the repo
 * @param { string } repo The repo that the user wants to pull from
 * @returns { Promise<object[]> } returns the issues in task object format 
 */
export async function getIssues(user, owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `${user.accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch issues.');
    }

    const data = await response.json();

    const arrayIssues = [];

    //Create task object from fetched data and populate array to return - return issues
    for (let i = 0; i < data.length; i ++) {
      const assignees = parseAssigneesLogin(data[i].assignees);
      if (assignees.includes(user.username)) {
        const parsedIssue = {
          type: 'issue',
          title: String(data[i].title),
          done: false,
          dueDate: data[i].updated_at instanceof Date 
            ? data[i].updated_at 
            : new Date(data[i].updated_at ),
          description: String(''),
          url: String(data[i].url),
          priority: String('high'),
          tags: [owner, repo]
        };
        arrayIssues.push(parsedIssue);
      }
    }
    return arrayIssues;
  }
  catch (error) {
    console.error(error);
  }
}