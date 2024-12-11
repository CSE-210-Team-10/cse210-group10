# Removing Codacy from the CI/CD Pipeline

## Context and Problem Statement

The team needed to decide the if Codacy code quality checks were truly useful for the project.

## Considered Options

* Remove Codacy code quality checks, relying only on ESLint and HTMLHint
* Keep Codacy code quality checks in addition to ESLInt and HTMLHint

## Decision Outcome

Chosen option: "Remove Codacy code quality checks, relying only on ESLint and HTMLHint", because the team found that ESLint and HTMLHint were more than sufficient for verifying the quality of our code and, additionally, Codacy added many duplicate, conflicting, and erraneous rules that caused excessive failures when checking pull requests. To mitigate the issues caused by Codacy implementation, the team decided it would be better to forgo the use of Codacy in favor of linting in the existing CI/CD pipeline.
