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
 * Fetch specified GitHub data and package it into a Task object.
 * @param { User } user The user data object
 * @param { string } owner The owner of the repo
 * @param { string } repo The repo that the user wants to pull from
 * @param { string } flag Either 'pulls' or 'issues' to pull from
 * @returns { Promise<object[]> } returns the GitHub data in a Task object format
 */
export async function getGithubData(user, owner, repo, flag) {
  const url = `https://api.github.com/repos/${owner}/${repo}/${flag}`;

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

    const res = [];

    for (let i = 0; i < data.length; i ++) {
      const assignees = parseAssigneesLogin(data[i].assignees);
      if (assignees.includes(user.username)) {
        const isPR = flag === 'pulls'; 
        const dueDate = isPR
          ? (data[i].created_at instanceof Date 
            ? data[i].created_at 
            : new Date(data[i].created_at))
          : (data[i].updated_at instanceof Date 
            ? data[i].updated_at 
            : new Date(data[i].updated_at));
        const typeGit = isPR ? 'pr' : 'issue';
        const url = isPR ? String(data[i].html_url) : String(data[i].url);
        const parsedTask = {
          type: typeGit,
          title: String(data[i].title),
          done: false,
          dueDate: dueDate,
          description: String(''),
          url: url,
          priority: String('high'),
          tags: [owner, repo]
        };
        res.push(parsedTask);
      }
    }
    return res;
  }
  catch (error) {
    console.error(error);
  }
}