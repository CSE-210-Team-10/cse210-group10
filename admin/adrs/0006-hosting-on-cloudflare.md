# Determine hosting platform for project

## Context and Problem Statement

The team needed to identify a hosting platform that would work for our unique set of requirements. The default was github.io, however one requirement that disqualified this was the need for hosting of dummy sites to test potential features. This would require a way to host the main site alongside a temporary site for all pull requests.

## Considered Options

* GitHub Pages
* Cloudflare

## Decision Outcome

Chosen option: "Cloudflare", because it includes the ability to host temporary sites without impacting the main site while also still being free and adding little overhead in implementation.
