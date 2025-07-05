import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './Context/CartContext';
import { WishlistProvider } from './Context/WishlistContext';
import { ProductContextProvider } from './Context/ProductContextProvider';
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from './Components/ErrorBoundary';
import { AuthProvider } from './Context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductContextProvider>
          <CartProvider>
            <WishlistProvider>
              <ErrorBoundary>
                <App />
                <Toaster position="bottom-center" />
              </ErrorBoundary>
            </WishlistProvider>
          </CartProvider>
        </ProductContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
