# api_demos

This repository contains demonstration code showing how to use the various
[Rewiring America APIs](https://api.rewiringamerica.org/docs/routes#overview)
in a variety of applications.

Demo Python notebooks can be found in the [`notebooks`](./notebooks) folder.
The demos include:

- [Health Impacts.ipynb](./notebooks/Health%20Impacts.ipynb), which shows off the use of our Health Impact API.
- [REM Demo.ipynb](./notebooks/REM%20Demo.ipynb), which illustrates
  basic REM API calls.
- [All About REM
  Statistics.ipynb](./notebooks/All%20About%20REM%20Statistics.ipynb), which
  digs into details on the statistics that the API returns and how they relate to one another in various
  circumstances.

Demo web site integrations include the following:

- A demo web site with a form and some JavaScript to call the API (in
the [`www`](./www) folder);
- The same demo web site written in react (in the [`react`](./react) folder);
- The same demo web site with better API key security using next.js and
  GCP Secret Manager (in the [`rem-with-nextjs`](./rem-with-nextjs) folder).

## A note on API Keys

An API key is required in order to use any of the Rewiring America APIs.
Please visit the
[Rewiring America APIs page](https://api.rewiringamerica.org) to sign up
for one.

