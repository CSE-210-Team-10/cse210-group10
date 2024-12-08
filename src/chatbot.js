
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

    const jsonData = await readJsonFile();
    // console.log(tasksString);
    const API_URL = "https://api.openai.com/v1/chat/completions";
  
    // Request payload for the API call
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
                            Here is the data: \n ${jsonData}`,
            },
            {
                role: "user",
                content: userMessage,
            },
        ],
      }),
    };
  
    // Making a call to OpenAI API
    try {
        // Send POST request to API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
    
        if (response.ok) {
          return data.choices[0].message.content.trim();  
        } else {
          throw new Error(data.error?.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error:", error);
        return "Oops, something went wrong. Please try again.";  
    }
};

//event listener - button click
document.getElementById('submit-button').addEventListener('click', async () => {
    const userInput = document.getElementById('input-box').value;
    
    if (userInput) {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML += <div><strong>You:</strong> ${userInput}</div>;
        
        const response = await chat(userInput);  
        chatBox.innerHTML += <div><strong>Bot:</strong> ${response}</div>;

        // Clear input field
        document.getElementById('input-box').value = '';  
        chatBox.scrollTop = chatBox.scrollHeight; 
      }
});
  

// Example 
export async function runExample() {
    var result = await chat("what is my adr issue");
    console.log("Response:", result);
}

runExample();