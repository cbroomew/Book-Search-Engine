import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    totalBooks: Int
    library: [Book]
  }

  type Book {
    id: String!
    authors: [String]
    summary: String
    title: String!
    coverImage: String
    url: String
  }

  type AuthResponse {
    token: String!
    user: User
  }

  type Query {
    currentUser: User
  }

  input BookInput {
    id: String!
    authors: [String]
    summary: String
    title: String!
    coverImage: String
    url: String
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!): AuthResponse
    authenticate(email: String!, password: String!): AuthResponse
    addBookToLibrary(input: BookInput!): User
    removeBookFromLibrary(id: String!): User
  }
`;
