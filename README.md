![Header](documentation/images/readme-header.png?raw=true)

_Default design by Tristan L.: [Twitter](https://www.google.com/url?q=https%3A%2F%2Ftwitter.com%2FTristanDardel&sa=D&sntz=1&usg=AFQjCNGXMboX2BYkhGnYs2XJxDhH1AOygw)_

# GitHub Monitoring

[![CircleCI](https://circleci.com/gh/Shudrum/GitHubMonitoring.svg?style=shield)](https://circleci.com/gh/Shudrum/GitHubMonitoring)
[![Dependency Status](https://gemnasium.com/badges/github.com/Shudrum/GitHubMonitoring.svg)](https://gemnasium.com/github.com/Shudrum/GitHubMonitoring)

**What is GitHub Monitoring?**

When you work for an active closed, open or inner source project, there is always a pull request debt.

You may want to motivate your team to be more active for the community and/or for the other team members. Maybe you want to set some response times?

This tool aim to display important events on big tv screens on open space offices to get some cool metrics and events about a project, and display all open pull requests with a simple color code showing:
 - Green if the response time from the pull request creation / last comment is respected,
 - Orange if the maximum response time delay is about to be reached,
 - Red if the maximum response time delay is exceeded.

It also show some events like:
 - Pull request created,
 - Pull request merged,
 - New comment on a pull request,
 - Repository forked,
 - Repository stared.

As mentioned before: this tool aim to be displayed on open spaces offices. The default design optimized for a 1920x1080 TV Screen. The designer chose the colors to avoid burned colors and for an improved readability.

> Many other events will be available soon, the very first version just fit my current organisation needs.

## Documentation

 1. [How to install and configure](documentation/install.md)
 2. Development
  1. How to create a theme

> The complete documentation is currently being written.
