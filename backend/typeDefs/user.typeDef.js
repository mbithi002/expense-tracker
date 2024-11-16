const userTypeDef = `#graphql
    type User {
        _id: ID!
        username: String!
        name: String!
        profilePicture: String!
        password: String!
        gender: String!
    }

    type Query {
        authUser: User
        user(userId: ID!): User
    }

    type Mutation {
     signUp(input: SignOpInput!): User
     login(input: LoginInput!): User
     logout: LogoutResponse
    }

    input SignOpInput {
        username: String!
        name: String!
        password: String!
        gender: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }
    
    type LogoutResponse {
        message: String!
    }
`

export { userTypeDef }
