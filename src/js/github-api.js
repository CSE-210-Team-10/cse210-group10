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
 * Fetch pull request data from specified parameters.
 * @param { string } token The SSO token generated
 * @param { string } owner The owner of the repo
 * @param { string } repo The repo that the user wants to pull from
 * @returns { Promise<JSON> } returns the pull requests data in json format
 */
export async function getPullRequests(token, owner, repo) {
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
    console.error(error);
  }
}

/**
 * Fetch issue data from specified parameters.
 * @param { string } token The SSO token generated
 * @param { string } owner The owner of the repo
 * @param { string } repo The repo that the user wants to pull from
 * @returns { Promise<JSON> } returns the issues data in json format
 */
export async function getIssues(token, owner, repo) {
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
    console.error(error);
  }
}