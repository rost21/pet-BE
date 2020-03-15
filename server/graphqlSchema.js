// #1 Import the gql method from apollo-server-express
const { gql } = require('apollo-server-express');

// #2 Construct a schema with gql and using the GraphQL schema language

// #3 Define the respective type with three fields
// Note that the _id is created automatically by mongoose
const typeDefs = gql`
  type User {
    id: ID
    firstname: String
    lastname: String
    username: String
    email: String
    password: String
    phone: String
    dateOfBirth: Int
    role: String
    isCustomer: Boolean
    skills: String
    rankings: Float
  },
  type UserResponse {
    isCreated: Boolean
    message: String
  },
  type LoginResponse {
    isLoggedIn: Boolean
    id: ID
    username: String
    email: String
    token: String
  },
  type Project {
    id: ID
    title: String
    shortDescription: String
    owner: User
    status: String
    members: [User]
    tasks: [Task]
    startDate: Int
    endDate: Int
  },
  input ProjectPayload {
    title: String
    shortDescription: String
    owner: ID
    status: String
    startDate: Int
    endDate: Int
  },
  type CreateProjectResponse {
    project: Project
    isCreated: Boolean
  },
  type Task {
    id: ID
    title: String
    description: String
    type: String
    reporter: User
    assignTo: User
    status: String
  },
  #4 Define the query type that must respond to 'posts' query
  type Query {
    users: [User]
    login(username: String!, password: String!): LoginResponse
    getUser(token: String!): User
    projects: [Project]
  },
  #5 Define a mutation to add new posts with two required fields
  type Mutation {
    register(username: String!, email: String!, password: String!, isCustomer: Boolean!): UserResponse
    deleteUser(id: String!): Boolean
    createProject(project: ProjectPayload!): CreateProjectResponse
  }
`;

module.exports = typeDefs;