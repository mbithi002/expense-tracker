import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/queries/user.query";
import Card from "./Card";

const Cards = () => {
    const { data, loading, error } = useQuery(GET_TRANSACTIONS)
    const { data: authUserData, loadingAuthUser } = useQuery(GET_AUTHENTICATED_USER)
    const { data: userAndTransactions } = useQuery(GET_USER_AND_TRANSACTIONS, {
        variables: {
            userId: authUserData?.authUser._id
        }
    })

    if (loading || loadingAuthUser) return <p className="text-center">Loading...</p>
    if (error) return <p className="text-center text-red-500">{error.message}</p>
    if (!loading && data?.transactions.length === 0) return (
        <p className='text-center text-gray-500'>No transactions Yet</p>
    )
    return (
        <div className='w-full px-10 min-h-[40vh]'>
            <p className='text-5xl font-bold text-center my-10'>History</p>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
                {
                    !loading && data?.transactions.map((transaction, i) => (
                        <Card key={i} transaction={transaction} />
                    ))
                }

            </div>
        </div>
    );
};
export default Cards;