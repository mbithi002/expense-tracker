import Transaction from '../models/transactions.model.js';

const transactionResolver = {
    Query: {
        transactions: async (_, __, context) => {
            try {
                if (!context.getUser()) throw new Error("unauthorized")
                const userId = await context.getUser()._id;
                const transactions = await Transaction.find({
                    userId
                })
                return transactions
            } catch (error) {
                console.log('Error in transactions: ', error);
                throw new Error(error.message) || 'something went wrong'
            }
        },
        transaction: async (_, { transactionId }) => {
            try {
                if (!context.getUser()) throw new Error("unauthorized")
                const transaction = await Transaction.findById(transactionId)
                return transaction
            } catch (error) {
                console.log('Error in transaction: ', error);
                throw new Error(error.message) || 'something went wrong'
            }
        },
        // TODO ADD CATEGORY STATISTICS QUERY
    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser().id
                })
                await newTransaction.save()
                return newTransaction
            } catch (error) {
                console.log("Error in create transaction", error);
                throw new Error("Error creating transaction")
            }
        },
        updateTransaction: async (_, { input }) => {
            try {
                const updateTransaction = await Transaction.findByIdAndUpdate(
                    input.transactionId,
                    input,
                    { new: true }
                )
                return updateTransaction
            } catch (error) {
                console.log("Error in update transaction", error);
                throw new Error("Error updating transaction")
            }
        },
        deleteTransaction: async (_, { transactionId }) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId)
                return deletedTransaction
            } catch (error) {
                console.log("Error in delete transaction", error);
                throw new Error("Error deleting transaction")
            }
        },
    },
    // TODO ADD TRANSACTION / USER RELATIONSHIP
}
export default transactionResolver