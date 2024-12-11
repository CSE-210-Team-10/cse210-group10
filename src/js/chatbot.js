import { getAllTasks } from './task/crud.js'; 
import { getGithubData } from './github-api.js'; 
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_ISSUES_KEY, GITHUB_PR_KEY } from './const.js';
import { authService } from './auth.js';

/** @typedef { import('./task/index.js').Task } Task */

/**
 * Fetches the OpenAI API key from a remote server.
 * 
 * @returns {Promise<string>} A promise that resolves to the API key as a string or an error message if the fetch fails.
 */
export async function fetchChatbotkey() {
  const URL = 'https://chatbot-key.onrender.com/apikey';
  try {
    const response = await fetch(URL, {
      method: 'GET',
      mode: 'cors',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.text()).trim();
    return data;
  } catch (error) {
    console.error(error);
    return 'ERROR: OPENAI API KEY is not available. Please try again or contact the owner.';
  }
}

/**
 * Communicates with the OpenAI API to fetch a chatbot response based on user input and task data.
 * 
 * @param {string} userMessage - The message input from the user.
 * @returns {Promise<string>} A promise that resolves to the chatbot's response.
 */
export async function chat(userMessage) {
  const contextData = await generateChatbotContext();

  const API_KEY = await fetchChatbotkey();
  if (API_KEY.startsWith('ERROR')) {
    return API_KEY;
  }

  const API_URL = 'https://api.openai.com/v1/chat/completions';

  // Request payload for the API call
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a Student Helper Assistant that answers questions based on the following data, 
                            but if the information is not present in the data, 
                            you can use your general knowledge to provide an answer.
                            For each item in the data the task type can be:
                            - "issue" for GitHub issues
                            - "pr" or "pull request" (these mean the same thing)
                            - "task" for personal tasks
                            Be flexible with the syntax and wording of these types.
                            Here is the data: \n ${contextData}`,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    if (response.ok) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error(data.error?.message || 'Unknown error');
    }
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