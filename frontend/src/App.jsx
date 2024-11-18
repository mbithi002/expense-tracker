import { useQuery } from '@apollo/client'
import Toaster from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/ui/Header'
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
import SignUpPage from './pages/SignUpPage'
import TransactionPage from './pages/TransactionPage'

function App() {
	const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER)

	if (loading) return
	return (
		<>
			{data?.authUser && <Header />}
			<Routes>
				<Route path='/' element={data?.authUser ? <HomePage /> : <Navigate to={'/signup'} replace />} />
				<Route path='/login' element={data?.authUser ? <HomePage /> : <LoginPage />} />
				<Route path='/signup' element={data?.authUser ? <HomePage /> : <SignUpPage />} />
				<Route path='/transaction/:id' element={data?.authUser ? <TransactionPage /> : <Navigate to={'/singup'} replace />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
			<Toaster />
		</>
	);
}
export default App;