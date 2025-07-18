# API Demos

This repository contains demonstration code showing how to use the various
[Rewiring America APIs](https://docs.rewiringamerica.org/introduction)
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

Client library demos include:

- [`rem.py`](./client-stubs/rem.py), a script using our Python client library
- [`rem.ts`](./client-stubs/rem.ts), a script using our TypeScript client library

## A note on API Keys

An API key is required in order to use any of the Rewiring America APIs.
Please visit the
[Rewiring America APIs page](https://docs.rewiringamerica.org/introduction) to sign up
for one.
