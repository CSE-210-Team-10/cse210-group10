# Pulling GitHub Data from Repositories Owned by Organizations

## Context and Problem Statement

The team ran into an issue where special permissions are required to pull data from repos owned by organizations on GitHub (i.e. the team's own repo).

## Considered Options

* Find a way to get around this
* Ignore organizational repos

## Decision Outcome

Chosen option: "Ignore organizational repos", because the user persona we constructed for students would likely mostly have private repos. It did not make sense to devote time and resources to finding a workaround (that likely does not exist) for accessing organization level repositories.
