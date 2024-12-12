import { getAllTasks } from './task/crud.js'; 
import { getGithubData } from './github-api.js'; 
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_ISSUES_KEY, GITHUB_PR_KEY } from './const.js';
import { authService } from './auth.js';

/** @typedef { import('./task/index.js').Task } Task */

/**
 * Communicates with the OpenAI API to fetch a chatbot response based on user input and task data.
 * 
 * @param {string} userMessage - The message input from the user.
 * @returns {Promise<string>} A promise that resolves to the chatbot's response.
 */
export async function chat(userMessage) {
  const contextData = await generateChatbotContext();

  const API_URL = 'https://ltbxtj6nuur4ztoth5gr7at3me0bpbri.lambda-url.us-east-2.on.aws/';

  try {
    const responseRequest = {
      method: 'POST',
      body: JSON.stringify({
        'jsonData': contextData,
        'userMessage': userMessage
      }),
    };
  
    const response = await fetch(API_URL, responseRequest);
    const groqResponse = await response.json();
    console.log(groqResponse.message);
  
    return groqResponse.message;
  } catch (error) {
    console.error('Error:', error);
    return 'Oops, something went wrong. Please try again.';
  }
}

/**
 * Formats a single task into a string representation
 * @param {Task} task The task to format
 * @returns {string} Formatted task string
 */
function formatTask(task) {
  return `
      ID: ${task.title}
      Type: ${task.type === 'personal' ? 'task' : task.type}
      ${task.dueDate ? `CreatedAt: ${task.dueDate.toISOString()}` : ''}
      Title: ${task.title}
      Status: ${task.done ? 'closed' : 'open'}
      Description: ${task.description || ''}
      Due Date: ${task.dueDate || ''}
      Tags: ${task.tags?.join(', ') || ''}
      Priority: ${task.priority || ''}
      Url: ${task.url || ''}
  `;
}

/**
 * Generates context for the chatbot by combining personal and GitHub tasks
 * @returns {Promise<string>} Combined tasks string
 * @throws {Error} If there's an error fetching or processing tasks
 */
async function generateChatbotContext() {
  try {
    const userData = authService.getGithubData();
    let tasksString = '';

    // Get and format personal tasks
    const personalTasks = getAllTasks();
    tasksString = personalTasks.map(formatTask).join('\n');

    // Get and format GitHub issues
    const issues = await getGithubData(userData, GITHUB_OWNER, GITHUB_REPO, GITHUB_ISSUES_KEY);
    if (issues.length > 0) {
      tasksString += `\n${ issues.map(formatTask).join('\n')}`;
    }

    // Get and format pull requests
    const pullRequests = await getGithubData(userData, GITHUB_OWNER, GITHUB_REPO, GITHUB_PR_KEY);
    if (pullRequests.length > 0) {
      tasksString += `\n${ pullRequests.map(formatTask).join('\n')}`;
    }

    return tasksString;
  } catch (error) {
    console.error('Error generating chatbot context:', error);
    throw error;
  }
}

// Example 
// export async function runExample() {
//   var result = await chat('what is my adr issue');
//   console.log('Response:', result);
// }

// runExample();