# Using AWS Lambda

## Context and Problem Statement

The team needed to decide how to retrieve the chatbot API key securely.

## Considered Options

* Host API key on website
* Use a serverless function through AWS Lambda and inject API Key

## Decision Outcome

Chosen option: "Use a serverless function through AWS Lambda and inject API Key", because of the security concerns of hosting the API key on a website; the team originally had deployed the API key on the website and encountered a security breach.
