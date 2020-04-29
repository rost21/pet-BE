const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require("cors");

// #2 Import mongoose
const mongoose = require('./server/config/database');
// #3 Import GraphQL type definitions
const typeDefs = require('./server/graphqlSchema');

// #4 Import GraphQL resolvers
const resolvers = require('./server/modules/resolvers');

// #5 Initialize an Apollo server
const server = new ApolloServer({
  typeDefs: [typeDefs],
  resolvers
});

// #6 Initialize an Express application
const app = express();
app.use(cors());
app.use(express.json());

// #7 Use the Express application as middleware in Apollo server
server.applyMiddleware({ app });

// #8 Set the port that the Express application will listen to
const port = process.env.PORT || 8001;
app.listen({ port }, () => {
  console.log(`Server running on http://localhost:${port}${server.graphqlPath}`);
});