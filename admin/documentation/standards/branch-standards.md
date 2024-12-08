# Branch Standards

Branching in this repository should follow specific criteria to ensure consistency across all developers. Additionally, this naming convention will allow easy identification for review.

## Main Branch

This branch is already created and will remain the production level branch. The branch will only contain code that is ready for deployment and that has passed all checks (unit testing, linting, and integration testing) in the CI/CD pipeline.

## Release Branch

This branch is also already created and will remain the staging level branch. This branch will only contain code that is ready for staging and that has passed unit testing and linting. This branch will also be used for developers to create branches off of for feature implementation. This branch will act as a staging environment to test new features and changes. Additionally, this branch will merge with the main branch at a specified time period.

## Developer Branches

These branches will exist for specific developers. The branch name must be dev/(NAME) where "NAME" is the developer's name. This is to ensure easy traceback to where new features and additions have come from. These branches will only be merged to the release branch (staging environment).
