// #1 Import the gql method from apollo-server-express
const { gql } = require('apollo-server-express');

// #2 Construct a schema with gql and using the GraphQL schema language

// #3 Define the respective type with three fields
// Note that the _id is created automatically by mongoose
const typeDefs = gql`
  # ===== User ===== #
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
  input RegisterPayload {
    username: String!
    email: String!
    password: String!
    isCustomer: Boolean!
  },
  type RegisterResponse {
    user: User
    isCreated: Boolean
  },
  input UpdateUserPayload {
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
  input LoginPayload {
    username: String!
    password: String!
  },
  type LoginResponse {
    isLoggedIn: Boolean
    id: ID
    username: String
    email: String
    token: String
  },
  type UpdateUserResponse {
    user: User
    isUpdated: Boolean
  },
  # ===== Project ===== #
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
    title: String!
    shortDescription: String
    owner: ID!
    status: String
    members: [ID]
    startDate: Int
    endDate: Int
  },
  type CreateProjectResponse {
    project: Project
    isCreated: Boolean
  },
  input UpdateProjectPayload {
    title: String
    shortDescription: String
    owner: ID
    status: String
    members: [ID]
    tasks: [ID]
    startDate: Int
    endDate: Int
  },
  type UpdateProjectResponse {
    project: Project
    isUpdated: Boolean
  }
  # ===== Task ===== #
  type Task {
    id: ID
    title: String
    description: String
    type: String
    reporter: User
    assignTo: User
    status: String
  },
  input CreateOrUpdateTaskPayload {
    title: String
    description: String
    type: String
    reporter: ID
    assignTo: ID
    status: String
  },
  type CreateTaskResponse {
    task: Task
    isCreated: Boolean
  },
  type UpdateTaskResponse {
    task: Task
    isUpdated: Boolean
  }
  #4 Define the query type that must respond to 'posts' query
  type Query {
    users: [User]
    login(data: LoginPayload!): LoginResponse
    getUser(token: String!): User
    projects: [Project]
    getProject(id: ID!): Project
    tasks: [Task]
    getTask(id: ID!): Task
  },
  #5 Define a mutation to add new posts with two required fields
  type Mutation {
    register(data: RegisterPayload!): RegisterResponse
    updateUser(id: ID!, data: UpdateUserPayload!): UpdateUserResponse
    deleteUser(id: ID!): Boolean
    createProject(data: ProjectPayload!): CreateProjectResponse
    updateProject(id: ID!, data: UpdateProjectPayload!): UpdateProjectResponse
    deleteProject(id: ID!): Boolean
    createTask(projectId: ID!, data: CreateOrUpdateTaskPayload!): CreateTaskResponse
    updateTask(id: ID!, data: CreateOrUpdateTaskPayload!): UpdateTaskResponse
    deleteTask(id: ID!): Boolean
  },
`;

module.exports = typeDefs;