## Intro

Stellar account as a service challenge

Check in repl.it here >>

<a hrfe="https://replit.com/@OrAlkin/stellar-bounty-l2"><img src="https://cdn.freebiesupply.com/logos/large/2x/replit-logo-svg-vector.svg" width="100">
</a>

## How it works

You as a custodian wallet inside the Crypto exchange can manage user's balances through the Stellar blockchain by use Muxed addresses.

- Register  POST `/register`
- Login     POST `/login`
- Pay       POST `/post`
- Info      GET  `/info`
- Friendbot POST `/friendbot` - only for test purpose

## Start the project

In the project directory, you can run:

### mv .env.example .env
### `npm i`
### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.


## Quick start after installation

1. Register the new user
2. Login with the user and set access_token to header "Authorization: Bearer {{access_token}}" 
3. Send some XLM to the muxed address from different account
4. Try to send received founds to another account ...