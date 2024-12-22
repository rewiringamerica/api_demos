# REM React Demo

This demonstration illustrates how to use [react](https://react.dev/) to call
Rewiring America's Residential Electrification(REM) API. It constructs a web page
that allows users to type in their address and current heating fuel and get an
estimate of how much they could save by switching to a heat pump.

To the user, the final result looks a lot like our [HTML/JavaScript demo](../www)
and our [React Demo](../react).

The difference is that this version is written in [Next.js](https://nextjs.org)
and takes advantage of it's unique `'use client'` and `'use server'` annotations
to make sure that part of the code runs on the server and part runs on the client.
The advantage of this is that the API key we use to call the REM API is never
visible on the client side. So nobody can see it simply by loading our page the
way they could with the [React Demo](../react).

To run this project in a development server on port 3000 of `localhost`, use 
T
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
