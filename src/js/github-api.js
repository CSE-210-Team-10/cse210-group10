/** @typedef { import('../js/auth.js').UserData } User */
/** @typedef { import('../js/task/index.js').Task } Task */

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
 * Fetches all repositories accessible to the authenticated user
 * @param { User } user User object containing authentication details
 * @returns { Promise<Array<{name: string, owner: string}>> } Array of repository objects containing name and owner
 * @throws { Error } If the API request fails
 */
async function getReposByUser(user) {
  try {
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${user.accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.map(repo => ({
      name: repo.name,
      owner: repo.owner.login,
    }));
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

/**
 * Fetch all GitHub tasks (issues and PRs) from all accessible repositories
 * @param { User } user User object containing authentication details
 * @returns { Promise<Task[]> } Array of standardized task objects
 * @throws {Error} If any API request fails
 */
export async function getTasksByUser(user) {
  try {
    // Use getRepo to fetch all repositories
    const repos = await getReposByUser(user);

    // Get tasks for each repo
    const tasks = await Promise.all(
      repos.map(repo => getTasksByRepoUser(user, repo))
    );

    return tasks.flat().filter(Boolean);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
}

/**
 * Fetch both issues and pull requests for a repository and return as tasks
 * @param { User } user User object containing authentication details
 * @param { {name: string, owner: string} } repo of repository objects containing name and owner
 * @returns { Promise<Task[] >} Array of task objects
 * @throws { Error } If the API request fails
 */
async function getTasksByRepoUser(user, repo) {
  const urls = [
    `https://api.github.com/repos/${repo.owner}/${repo.name}/issues`,
    `https://api.github.com/repos/${repo.owner}/${repo.name}/pulls`,
  ];

  try {
    const responses = await Promise.all(
      urls.map(url =>
        fetch(url, {
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${user.accessToken}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })
      )
    );

    if (!responses.every(res => res.ok)) {
      throw new Error('Failed to fetch GitHub data');
    }

    const [issuesData, pullsData] = await Promise.all(
      responses.map(res => res.json())
    );

    const res = [];

    // Process both issues and PRs
    [...issuesData, ...pullsData].forEach(item => {
      const assignees = parseAssigneesLogin(item.assignees);

      if (assignees.includes(user.username)) {
        const isPR = 'pull_request' in item;
        const dueDate = isPR
          ? new Date(item.created_at)
          : new Date(item.updated_at);

        const tags = [repo.name];

        if (repo.owner !== user.username) tags.push(repo.owner);

        res.push({
          type: isPR ? 'pr' : 'issue',
          title: String(item.title),
          done: false,
          dueDate,
          description: '',
          url: String(isPR ? item.html_url : item.url),
          priority: 'high',
          tags,
        });
      }
    });

    return res;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
}
