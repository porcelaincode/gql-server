This is a graphql express server with 3 basic auth routes as stated below for the client[https://github.com/porcelaincode/gql-client].

It is backed with mongodb as database and apollo-graphql as server backbone.

## Types

### Queries

```javascript
// user
getUser;
```

### Mutations

```javascript
// user
login;
register;
```

## Configure server

Setup env variables after creating `.env` file in the root directory. Following env variables are necessary for fully functioning server. More can be added accordingly

```sh
PORT=5000
NODE_ENV=
TOKEN_SECRET=
MONGODB_CONNECTION_STRING=
```

## Steps to replicate deployment

1. Clone the github repo

   `git clone https://github.com/porcelaincode/gql-server`

2. Install npm packages

   `npm install`

3. Configure `.env` file as mentioned above

4. Run development server

   `npm start`

5. Test endpoint at [https://studio.apollographql.com](https://studio.apollographql.com/sandbox/explorer) by using url
   `http://localhost:5000/graphql`
