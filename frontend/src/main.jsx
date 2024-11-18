import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import GridBackground from './components/ui/GridBackground.jsx'
import './index.css'

const client = new ApolloClient({
  // TODO UPDATE URL ON PRODUCTION
  uri: String(import.meta.env.VITE_NODE_ENV) === "development" ? 'http://localhost:4000/graphql' : '/graphql',
  cache: new InMemoryCache(),
  credentials: "include"
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </StrictMode>,
)