# CI/CD Pipeline Documentation

The CI/CD pipeline is designed to ensure safe development practices, along with proper developer practices for this project. We utilize **GitHub Actions** to integrate the tools below for different purposes. The reasons behind our choices of tools will be written in ADRs. As a reference, the CI/CD diagram gives a end-to-end view of how the pipeline will operate.

![CI/CD Pipeline](cicd.png)

## Current Functionality

Currently, our pipeline supports:

1. Code Quality via Human Review: Pull Requests and Branch Protection
2. Unit Tests via automation: Jest
3. Documentation generation via Human: JSDocs on VSCode
4. Packaging (or Bundling for Production) via automation: Terser
5. Deployment via automation: Cloudflare
6. Linting: ESLint
7. End-to-End Tests/Integration Tests: Cypress

Currently, the pipeline supports unit testing for front-end related code (JS). All developers implement new features in developer branches off of the staging environment. 

When a developer creates a pull request, unit tests are run on the new code. If these pass, a built production-ready bundle will be deployed on Cloudflare using Cloudflare CLI. 

Next, a human reviewer can inspect the code and the preview site and ensure visual consistency and functionality. Once the reviewer approves the pull request, the code is merged with the staging branch. 

After this, the staging branch is merged with the main (production) branch at a given time interval.

Notes: The decisions behind using these technologies are detailed in their respective ADRs.

## Future Functionality

In the future, a few key needs have been identified that will be built out. These are listed below in order of priority:

1. Backend Unit Tests for Web Server
2. Backend Unit Tests for Database
