# api_demos

This repository contains demonstration code showing how to use the various
[Rewiring America APIs](https://api.rewiringamerica.org/docs/routes#overview)
in a variety of applications.

Demo Python notebooks can be found in the [`notebooks`](./notebooks) directory.

A demo web site with a form and some JavaScript to call the API can be found in
the [`www`](./www) directory.

## A note on API Keys

An API key is required in order to use any of the Rewiring America APIs.
Please visit the
[Rewiring America APIs page](https://api.rewiringamerica.org) to sign up
for one.

The demo notebooks don't have an API key hardcoded (for good reason).
Instead, they look in a diretory named `.rwapi` in your home directory
for a file called `api_key.txt`. You should create this file as a one line
file with your API key in it. Then the notebooks will be able to find it.
