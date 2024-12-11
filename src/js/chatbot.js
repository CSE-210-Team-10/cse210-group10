import { getAllTasks } from './task/crud.js'; 
import { getIssues, getPullRequests } from './github-api.js'; 
import { PROVIDER_TOKEN_KEY, GITHUB_OWNER, GITHUB_REPO } from './const.js';

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
 * Reads and formats task/issue data from multiple sources
 * @async
 * @function generateChatbotContext
 * @returns {Promise<string>} A formatted string containing all tasks/issues from localStorage and GitHub
 * @throws {Error} If there is an issue processing the data.
 */
async function generateChatbotContext() {
  try {
    const personalTasks = getAllTasks();
    let tasksString = '';

    if (personalTasks.length > 0) {
      tasksString = personalTasks
        .map(task => {
          const type = task.type === 'personal' ? 'task' : 
            task.type;
          return `
              ID: ${task.title}
              Type: ${type}
              CreatedAt: ${task.dueDate.toISOString()}
              Title: ${task.title}
              Status: ${task.done ? 'closed' : 'open'}
              Description: ${task.description ? task.description : ''}
              Due Date: ${task.dueDate ? task.dueDate : ''}
              Tags: ${task.tags?.join(', ') || ''}
              Priority: ${task.priority ? task.priority : ''}
              Url: ${task.url ? task.url : ''}
          `;
        })
        .join('\n');
    }

    const githubToken = localStorage.getItem(PROVIDER_TOKEN_KEY);
    
    const issues = await getIssues(githubToken, GITHUB_OWNER, GITHUB_REPO);

    if (issues.length > 0){
      tasksString += `\n ${ issues
        .map(task => `
              ID: ${task.title}
              Type: ${task.type}
              Title: ${task.title}
              Status: ${task.done ? 'closed' : 'open'}
              Description: ${task.description ? task.description : ''}
              Due Date: ${task.dueDate ? task.dueDate : ''}
              Tags: ${task.tags?.join(', ') || ''}
              Priority: ${task.priority ? task.priority : ''}
              Url: ${task.url ? task.url : ''}
          `)
        .join('\n')}`;
    }

    const pullRequests = await getPullRequests(githubToken, GITHUB_OWNER, GITHUB_REPO);

    if (pullRequests.length > 0) {
      tasksString += `\n ${ pullRequests
        .map(task => `
                ID: ${task.title}
                Type: ${task.type}
                Title: ${task.title}
                Status: ${task.done ? 'closed' : 'open'}
                Description: ${task.description ? task.description : ''}
                Due Date: ${task.dueDate ? task.dueDate : ''}
                Tags: ${task.tags?.join(', ') || ''}
                Priority: ${task.priority ? task.priority : ''}
                Url: ${task.url ? task.url : ''}
            `)
        .join('\n')}`;
    }
    return tasksString;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw error;
  }
}

// Example 
// export async function runExample() {
//   var result = await chat('what is my adr issue');
//   console.log('Response:', result);
// }

// runExample();