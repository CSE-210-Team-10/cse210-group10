import { chat } from '../js/chatbot.js';

/**
 *event listener - button click
 *Display welcome message on page load
 */
window.onload = () => {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML += 
                `<div class="bot-message">
                    Welcome to <strong>DuckyAI</strong>! 🦆<br>
                    I’m your friendly, feathered assistant, ready to quack through any task or question you’ve got! 
                    I’ve got you covered!😊
                </div>`;
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
};

// Event listener - button click
document.getElementById('submit-button').addEventListener('click', async () => {
  const userInput = document.getElementById('input-box').value;

  if (userInput) {
    const chatBox = document.getElementById('chat-box');

    // Add user's message
    chatBox.innerHTML += 
            `<div class="user-message">
                ${userInput}
            </div>`;

    // Fetch bot response and add it
    const response = await chat(userInput);
    chatBox.innerHTML += 
            `<div class="bot-message">
                ${response}
            </div>`;

    // Clear input box and scroll chat box
    document.getElementById('input-box').value = '';
    chatBox.scrollTop = chatBox.scrollHeight; // Keep the chat scrolled to the latest message
  }
});