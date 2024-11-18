import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { BsCardText } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaLocationDot, FaSackDollar } from "react-icons/fa6";
import { HiPencilAlt } from "react-icons/hi";
import { MdOutlinePayments } from "react-icons/md";
import { Link } from "react-router-dom";
import { DELETE_TRANSACTION } from '../graphql/mutations/transaction.mutation';
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query';
import { formatDate } from "../utils/formatDate";

const categoryColorMap = {
	saving: "from-green-700 to-green-400",
	expense: "from-pink-800 to-pink-600",
	investment: "from-blue-700 to-blue-400",
};

const Card = ({ transaction }) => {
	const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);
	let { category, amount, location, date, paymentType, description, } = transaction
	const cardClass = categoryColorMap[category];
	description = description[0]?.toUpperCase() + description.slice(1)
	const [deleteTransaction, { loading, error }] = useMutation(DELETE_TRANSACTION, {
		refetchQueries: ['getTransactions', 'GetcategoryStatistics']
	})

	const handleDelete = async () => {
		try {
			await deleteTransaction({
				variables: {
					transactionId: transaction._id
				}
			})
			toast.success('Transaction deleted successfully')
		} catch (error) {
			toast.error(error.message)
			console.log("error deleting transaction", error);
		}
	}

	return (
		<div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
			<div className='flex flex-col gap-3'>
				<div className='flex flex-row items-center justify-between'>
					<h2 className='text-lg font-bold text-white'>
						{category}
					</h2>
					<div className='flex items-center gap-2'>
						{
							loading ? <div className="size-5 border-t-2 border-b-2 rounded-full animate-spin"></div> : <FaTrash onClick={handleDelete} className={"cursor-pointer"} />
						}
						<Link to={`/transaction/${transaction?._id}`}>
							<HiPencilAlt className='cursor-pointer' size={20} />
						</Link>
					</div>
				</div>
				<p className='text-white flex items-center gap-1'>
					<BsCardText />
					Description: {description}
				</p>
				<p className='text-white flex items-center gap-1'>
					<MdOutlinePayments />
					Payment Type: {paymentType}
				</p>
				<p className='text-white flex items-center gap-1'>
					<FaSackDollar />
					Amount: ${amount}
				</p>
				<p className='text-white flex items-center gap-1'>
					<FaLocationDot />
					Location: {location || 'N / A'}
				</p>
				<div className='flex justify-between items-center'>
					<p className='text-xs text-black font-bold'>
						{
							formatDate(date)
						}
					</p>
					<img
						src={authUserData?.authUser.profilePicture}
						className='h-8 w-8 border rounded-full'
						alt=''
					/>
				</div>
			</div>
		</div>
	);
};
export default Card;