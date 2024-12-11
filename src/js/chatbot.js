import { getAllTasks } from './task/crud.js'; 
/**
 * Reads and processes a JSON object containing tasks.
 * 
 * @returns {Promise<string>} A promise that resolves to a formatted string of tasks.
 * @throws {Error} If there is an issue processing the JSON data.
 */
async function readJsonFile() {
  try {
    const jsonData = getAllTasks();

    const tasksString = jsonData
      .map(task => `
              ID: ${task.id}
            Type: ${task.type}
            CreatedAt: ${task.dueDate.toISOString()}
              Title: ${task.title}
            Status: ${task.done ? 'closed' : 'open'}
            Body: ${task.tags.join(', ')}
            Priority: ${task.priority}
      `)
      .join('\n');
    return tasksString;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw error;
  }
}

/**
 * Communicates with AWS Lambda function -> Groq API to fetch a chatbot response based on user input and task data.
 * 
 * @param {string} userMessage - The message input from the user.
 * @returns {Promise<string>} A promise that resolves to the chatbot's response.
 */
export async function chat(userMessage) {

  const jsonData = await readJsonFile();
  const API_URL = "https://ltbxtj6nuur4ztoth5gr7at3me0bpbri.lambda-url.us-east-2.on.aws/";

  // Request payload for AWS Lambda Call
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({'jsonData': jsonData, 'userMessage': userMessage}),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error?.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error:', error);
    return 'Oops, something went wrong. Please try again.';
  }
}