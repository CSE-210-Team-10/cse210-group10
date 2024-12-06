import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


async function chat(userQuery) {

    try{
        const chatCompletion = await client.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful Student Assistant.
                                Guidelines:
                                1. Please respond strictly within 100 words. 
                                2. Do not make information up.
                                3. Be consise with your response.
                                4. Only provide specifc answer. Do not provide other information.`
                },
                {
                    role: 'user',
                    content: userQuery
                }
            ],
            model: 'gemma-7b-it',
            temperature: 0.7,
            max_tokens: 80
        });

        const assistantResponse = chatCompletion.choices[0].message.content;
        return assistantResponse;
    }catch(error){
        console.error('Error:', error);
        return 'Could not fetch the information required. Please try again!';
    }
}