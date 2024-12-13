# Use Supabase for GitHub Authentication

## Context and Problem Statement

The team needed to utilize a tool to enable GitHub Authentication on our dashboard. As such, a few options were reviewed.

## Considered Options

* Supabase
* Firebase
* Host own SSO service

## Decision Outcome

Chosen option: "Supabase", because it is an open source version of Firebase's Authentication service. It also reduces complexity of having to host our own SSO (decreasing risk of accidental complexity). Supabase also has a simpler implementation.
