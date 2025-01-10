# Python Demos

This directory contains demo Python notebooks that illustrate how we can call Rewiring America's
Health Impact and Resident Electrification Model (REM) APIs. 

The demos are:

- [Health Impacts.ipynb](./Health%20Impacts.ipynb), which shows off the use of our Health Impact API.
- [REM Demo.ipynb](./REM%20Demo.ipynb), which illustrates
  basic REM API calls.
- [All About REM
  Statistics.ipynb](./All%20About%20REM%20Statistics.ipynb), which
  digs into details on the statistics that the API returns and how they relate to one another in various
  circumstances.

The demo notebooks don't have an API key hardcoded (for good reason).
Instead, they look in a diretory named `.rwapi` in your home directory
for a file called `api_key.txt`. You should create this file as a one line
file with your API key in it. Then the notebooks will be able to find it.
