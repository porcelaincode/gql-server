const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");

const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const typeDefs = require("./graphql/types");
const resolvers = require("./graphql/resolvers");

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

require("dotenv").config();

const PORT: any = process.env.PORT || 5000;
const DATABASE: string =
  process.env.MONGODB_CONNECTION_STRING || "mongosrv:\\localhost:27017";

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
export async function startApolloServer() {
  const app = express();

  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === "production" ? undefined : false,
    })
  );

  const httpServer = createServer(app);

  // Save the returned server's info so we can shutdown this server later

  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,

    context: ({ req }: any) => ({ req }),
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      ApolloServerPluginLandingPageLocalDefault({
        embed: process.env.NODE_ENV === "development",
      }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise(() =>
    httpServer.listen(PORT, () => {
      console.log(
        `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
      );
    })
  );
}

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return startApolloServer();
  });
