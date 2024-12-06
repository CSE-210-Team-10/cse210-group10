import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function chat() {
    const chatCompletion = await client.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant.'
            },
            {
                role: 'user',
                content: 'Hello, how are you?'
            }
        ],
        model: 'gemma-7b-it'
    });

    console.log(chatCompletion.choices[0].message.content);
    return chatCompletion.choices[0].message.content;
}

chat().then( output => {
    console.log(output);
  });