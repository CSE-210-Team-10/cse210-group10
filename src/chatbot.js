
const API_KEY = '';

import fs from 'fs/promises';

async function readJsonFile() {
    try {
        const data = await fs.readFile('./src/mock/mock-tasks.json', 'utf8');
        const jsonData = JSON.parse(data);

        const tasksString = jsonData.tasks.map(task => {
            const type = task.type === "personal" ? "task" : task.type;
            return `
              ID: ${task.id}
              Type: ${type}
              CreatedAt: ${task.createdAt}
              Title: ${task.title}
              Status: ${task.status}
              Body: ${task.body}
              URL: ${task.url}
            `;
          }).join('\n');
        return tasksString;
    } catch (error) {
        console.error('Error reading JSON file:', error);
        throw error;
    }
}

export async function chat(userMessage) {

    const tasksString = await readJsonFile();
    // console.log(tasksString);
    const API_URL = "https://api.openai.com/v1/chat/completions";
  
    // Setup the request payload for the API call
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are a Student Helper Assistant that answers questions based on the following data, 
                        but if the information is not present in the data, 
                        you can use your general knowledge to provide an answer.
                        For each item in the data the task type can be "issue", "pull_request", or "task".
                        Be flexible with the syntax and working of "type" field 
                        Here is the data: \n ${tasksString}`,
            },
            {
                role: "user",
                content: userMessage,
            },
        ],
      }),
    };
  
    // Send the request to the OpenAI API
    try {
        // Send POST request to API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
    
        // Check for successful response
        if (response.ok) {
          return data.choices[0].message.content.trim();  // Return the chatbot's response
        } else {
          throw new Error(data.error?.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error:", error);
        return "Oops, something went wrong. Please try again.";  // Error handling message
      }
  };
  

// Example usage
export async function runExample() {
    var result = await chat("what is my adr issue");
    console.log("Response:", result);
}

runExample();