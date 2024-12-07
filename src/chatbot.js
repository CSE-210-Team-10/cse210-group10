import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { getIssues, getPullRequests } from './githubAPI.js';

dotenv.config();

class GroqLLM {
    constructor() {
        this.client = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }

    async call(prompt) {
        try {
            const response = await this.client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gemma-7b-it",
                temperature: 0.7,
                max_tokens: 150
            });
            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error("Error with Groq LLM:", error);
            throw new Error("Failed to get response from Groq LLM.");
        }
    }
}

// Initialize Groq LLM
const groqLLM = new GroqLLM();

async function isQueryRelevantToData(query, jsonData) {
    const prompt = `
        You are an assistant tasked with determining whether a user query relates to specific JSON data. 
        JSON data: ${JSON.stringify(jsonData)}
        Query: "${query}"
        Does this query relate to the JSON data? Answer with "yes" or "no" only.`;

    const response = await groqLLM.call(prompt);
    return response.toLowerCase().includes("yes");
}


async function chat(userQuery) {

    var jsonData = await getIssues();
    const isRelevant = await isQueryRelevantToData(userQuery, jsonData);
    var response = "";
    try{

        if (isRelevant){
            const prompt = `
                You are a helpful assistant. Use only the information provided in the following text to answer the user's query. 
                Do not use any external knowledge unless explicitly asked. Consider each item in the response as a task, issue or pull request 

                Text: "${jsonData}"

                User Query: "${userQuery}"
            `;

            response = await groqLLM.call(prompt);
        }else{
            response = await groqLLM.call(userQuery);
        }
        return response;

    }
    catch(error) {
        console.error('Error:', error);
        return 'Could not fetch the information required. Please try again!';
    }
}

// Testing
async function runConversation() {
    try {
        var output = await chat("what is the title of my task, when was it last updated");
        console.log(output);
        output = await chat("when was james anderson born");
        console.log(output);
    } catch (error) {
        console.error('Conversation error:', error);
    }
}


runConversation();