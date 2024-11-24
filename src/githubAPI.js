// const fetch = import('node-fetch');
import fetch from 'node-fetch';
import { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } from './constants.js'

const owner = GITHUB_OWNER; 
const repo = GITHUB_REPO; 
const username = "sammedkamate"; //change username

const token = GITHUB_TOKEN// Fill with own, you can also just run without but rate limited

// Function to get JSON of GitHub issues
export async function getIssues() {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;


  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const issues = await response.json();
  const headers = await response.headers;
  // console.log(JSON.stringify(issues, null, 2))

  const rateLimitRemaining = headers.get('x-ratelimit-remaining');
  if (rateLimitRemaining == '0'){
    const remainingTime = headers.get('x-ratelimit-reset');
    const retryAfter = new Date(parseInt(remainingTime, 10) * 1000).toUTCString();
    console.log(`Github rate limited exceeded. Retry after - ${retryAfter}`);
    return {'error': `Retry after: ${retryAfter}`};
  }

  const filteredIssues = filterIssuesByAssignee(issues, username);

  return JSON.stringify(filteredIssues, null, 2);
}

// Function to get PRs
export async function getPullRequests() {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;
  
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    const issues = await response.json()
    console.log(JSON.stringify(issues, null, 2))
  }

getIssues().then( output => {
  console.log(output);
});


function filterIssuesByAssignee(issues, assigneeUsername) {
  // Filter issues that do not contain the 'pull_request' key
  const filteredIssues = issues.filter(issue => !issue.hasOwnProperty('pull_request') && 
  (issue.assignees && issue.assignees.some(assignee => assignee.login === assigneeUsername)));

  // Map the filtered issues to include only the required fields
  return filteredIssues.map(issue => ({
    id: issue.id,
    url: issue.url,
    title: issue.title,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    body: issue.body,
    timeline_url: issue.timeline_url
  }));
}


// module.exports = {getIssues, getPullRequests};
