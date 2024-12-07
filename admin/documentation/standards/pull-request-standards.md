# Pull Request Standards

This document will detail the guidelines for pull request naming and formatting.

## Naming

Pull requests must be named in the following format:

```
descriptor-developer
```

Where "descriptor" is a short description of the changes contained in the pull request and "developer" is the developer who is creating the pull request.

## Content

A pull request must detail the specific work done. The format should be as follows:

```
Feature/Change Description: {fill in here / okay if bulleted list below}

Developer Contributions: {fill in who worked on what}

Dependencies {fill in any features that are dependent on these changes and any special considerations that need to be made because of this}
```

## Example

An example pull request can be seen below to demonstrate an effective use of the system:

Title: 
```
"implement-hover-functionality-shayan"
```

Content:
```
Feature/Change Description:
* Added hover functionality to footnotes
* Added fail safe press feature for mobile use case

Developer Contributions:
* Shayan - Added hover functionality
* David - Added fail safe press feature for mobile use case

Dependencies 
* Group footnote functionality is dependent, however design ensures that these changes will automatically be updated to group
* Considerations may be needed to make sure overlapping footnotes in groups are accounted for
```

