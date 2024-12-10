# ADR Standards

This document will outline how ADRs will be named and formatted in this repository.

## Naming

ADR naming will follow the MADR naming convention. The name will consist of the following "XXXX-descriptor" where "XXXX" is a sequential numerical value in relation to all ADRs (starting at 0000 and incrementing) and "descriptor" is a descriptive name for the decision to which the ADR is related to.

## Content

The ADR will be formatted according to MADR minimal convention. This includes a title, context/problem statement, considered options, and outcome.

### Title

The title will have information regarding the problem and the chosen solution.

### Context/Problem Statement

The context/problem statement section is to flesh out the problem the team faced, and illustrates the thought process of the team.

### Considered Options

The considered options sections is a bullet point list of all the alternative options, including the chosen solution.

### Outcome

The outcome section has a specific formatting seen below:

```
Chosen option: "{title of option 1}", because {justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force {force} | … | comes out best (see below)}.
```

As seen in the format above, the key factors for this section are the chosen outcome and the justification of why the team decided to choose this.
