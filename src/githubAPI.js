// const fetch = import('node-fetch');
import fetch from 'node-fetch';
import { GITHUB_TOKEN } from './constants.js'

const owner = 'CSE-210-Team-10'; //owner is organization name in this case
const repo = 'group10-esc012'; //repo

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

  return JSON.stringify(issues, null, 2);
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


// module.exports = {getIssues, getPullRequests};
