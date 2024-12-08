
const API_KEY = '';


async function readJsonFile() {
    try {
        const jsonData = {
            "tasks": [
              {
                "id": 2686988886,
                "type": "issue",
                "title": "Update README file with relevant information about repository",
                "status": "open",
                "createdAt": "2024-11-24T03:21:13Z",
                "number": null,
                "body": "Task\r\n- Update README file seen on main page to have relevant and useful information regarding the repo\r\n\r\nDeliverables\r\n- Updated README file",
                "url": "https://api.github.com/repos/CSE-210-Team-10/group10-esc012/issues/54"
              },
              {
                "id": 2686983987,
                "type": "issue",
                "title": "ADRs for CI/CD",
                "status": "open",
                "createdAt": "2024-11-24T03:16:01Z",
                "number": null,
                "body": "Task\r\n- Create ADRs for CI/CD decisions (such as use of Jest, ESLint, any integration tools, etc.)\r\n\r\nDeliverables\r\n- ADR files to cover all decisions made up to this sprint for the CI/CD pipeline",
                "url": "https://api.github.com/repos/CSE-210-Team-10/group10-esc012/issues/53"
              },
              {
                "id": 2686982225,
                "type": "task",
                "title": "ADRs for Front End Decisions",
                "status": "open",
                "createdAt": "2024-11-24T03:14:58Z",
                "number": null,
                "body": "Task\r\n- Create ADRs for front end decisions (such as use of Figma, Miro)\r\n\r\nDeliverables\r\n- ADR files to cover all decisions made up to this sprint for the front end",
                "url": "https://api.github.com/repos/CSE-210-Team-10/group10-esc012/issues/52"
              },
              {
                "id": 2686979124,
                "type": "personal",
                "title": "Update CI/CD Documentation Based on Updated Pipeline Implementation",
                "status": "open",
                "createdAt": "2024-11-24T03:14:02Z",
                "number": null,
                "body": "Task\r\n- Redo the CI/CD pipeline diagram and documentation to be up to date with the implementation\r\n\r\nDeliverables\r\n- Updated cicd.md\r\n- Updated cicd.png",
                "url": "https://api.github.com/repos/CSE-210-Team-10/group10-esc012/issues/51"
              },
              {
                "id": 2201945766,
                "type": "pull request",
                "title": "ADR Dashboard",
                "status": "open",
                "createdAt": "2024-11-26T21:37:41Z",
                "number": 57,
                "body": "## Pull Request Description\r\n\r\n### Overview\r\nThis PR introduces a basic student dashboard with a side bar that has the links and videos components. In the main content area we have 2 container, first one is for upcoming deadlines and the second for for all the github tasks and calendar view.",
                "url": "https://api.github.com/repos/CSE-210-Team-10/group10-esc012/pulls/57"
              }
            ]
        }

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

async function chat(userMessage) {

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