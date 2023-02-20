import { gql } from "apollo-server-express";

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String
    lastLogin: String
    token: String!
  }
  input UserInfoInput {
    name: String
    email: String!
    password: String!
  }
  type Query {
    getUser: User!
  }
  type Mutation {
    register(creds: UserInfoInput): User!
    login(creds: UserInfoInput): User!
  }
`;
