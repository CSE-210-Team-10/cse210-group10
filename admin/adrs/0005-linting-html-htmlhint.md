# Select HTMLHint for Linting HTML

## Context and Problem Statement

The team needed to decide the best way to lint Javascript files as part of the CI/CD pipeline.
## Considered Options

* HTMLHint
* W3C Validator

## Decision Outcome

Chosen option: "HTMLHint", because it is lightweight and fast, easy to configure, and provides good integration with most editors, while W3C Validator lacks default local integration and customization options.
