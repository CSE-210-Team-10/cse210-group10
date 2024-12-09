import { chat } from './chatbot.js';

//event listener - button click
document.getElementById('submit-button').addEventListener('click', async () => {
    const userInput = document.getElementById('input-box').value;
    
    if (userInput) {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML += `<div><strong>You:</strong> ${userInput}</div>`;
        
        const response = await chat(userInput);  

        chatBox.innerHTML += `<div><strong>Bot:</strong> ${response}</div>`;
        document.getElementById('input-box').value = '';  
        
        chatBox.scrollTop = chatBox.scrollHeight; 
    }
});

