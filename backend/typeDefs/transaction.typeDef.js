const transactionTypeDef = `#graphql
    type Transaction {
        _id: ID!
        userId: ID!
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String!
    }

    type Query {
        transactions: [Transaction!]
        transaction(transactionId: ID): Transaction
        createTransaction(input: createTransactionInput!): Transaction
        updateTransaction(input: updateTransactionInput!): Transaction
        deleteTransaction(transactionId: ID!): Transaction!
    }

    input createTransactionInput {
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
    }

    input updateTransactionInput {
        transactionId: ID!
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
    }
`

export { transactionTypeDef }
