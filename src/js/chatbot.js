import { getAllTasks } from './task/crud.js'; 
import { getTasksByUser } from './github-api.js'; 
import { authService } from './auth.js';

/** @typedef { import('./task/index.js').Task } Task */

/**
 * Communicates with a Lambda API to fetch a chatbot response based on user input and task data
 * 
 * @async
 * @param {string} userMessage - The message input from the user
 * @returns {Promise<string>} A promise that resolves to:
 *  - The chatbot's response message if successful
 *  - An error message if the request fails
 * @throws {Error} If there's an error in the API communication
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
    let tasksString = '';

    // Get and format personal tasks
    const personalTasks = getAllTasks();
    tasksString = personalTasks.map(formatTask).join('\n');

    const userData = authService.getGithubData();

    // Get and format GitHub issues/ pr
    const githubIssues = await getTasksByUser(userData);
    if (githubIssues.length > 0) {
      tasksString += `\n${ githubIssues.map(formatTask).join('\n')}`;
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