import { ChatGroq } from "@langchain/groq";
import { Tool } from "langchain/tools";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { getIssues, getPullRequests } from './githubAPI.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Tool for fetching GitHub issues
 */
class GitHubIssuesTool extends Tool {
    name = "github_issues";
    description = "Fetches GitHub issues assigned to a specific user. Use this when you need to check GitHub issues.";

    async _call() {
        try {
            const issues = await getIssues();
            // console.log(issues);
            return issues;
        } catch (error) {
            return `Error fetching GitHub issues: ${error.message}`;
        }
    }
}


/**
 * Fallback tool for general knowledge queries
 * Used when no specific tool matches the query
 */

class GeneralKnowledgeTool extends Tool {
    name = "general_knowledge";
    description = "Use this tool for general knowledge questions, facts, and information that cant be answered by other tools";

    async _call(input) {
        try {
            // The LLM will use its base knowledge to answer general questions
            return `I'll help answer your general knowledge question: ${input}`;
        } catch (error) {
            return `Error processing general knowledge query: ${error.message}`;
        }
    }
}

// Create agent executor
async function createAgent() {
    const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 150
    });

    // Create tools array
    const tools = [
        new GitHubIssuesTool(),
        new GeneralKnowledgeTool()
    ];

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a helpful student assistant that uses tools to solve problems. 
            If no specific tool matches the query, use the general knowledge tool as the last option.
            Only display or output the answer to the user query. Do not mention anything about tools or other analysis.`],
        ["human", "{input}"],
        ["assistant", "Let me approach this step by step:"],
        new MessagesPlaceholder("agent_scratchpad")
    ]);

    const agent = await createOpenAIToolsAgent({
        llm: model,
        tools: tools,
        prompt: prompt
    });

    return new AgentExecutor({
        agent,
        tools,
        verbose: false
    });
}


// Main chat function
async function chat(input) {
    try {
        const executor = await createAgent();
        const result = await executor.invoke({
            input: input
        });

        if (result.output && 
            (result.output.toLowerCase().includes('failed') || 
             result.output.toLowerCase().includes('error'))) {
            return "I need a rain check on that question, this question is beyond my current capabilities.";
        }
        return result.output;
    } catch (error) {
        console.error("Error:", error);
        return { error: true, message: error.message };
    }
}

// Example usage
async function runExample() {
    var response = await chat("What is graph database");
    console.log("Response:", response);
    var result = await chat("how many github issues do i have");
    console.log("Response:", result);
}

runExample();