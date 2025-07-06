import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';

const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    productService.getProducts()
      .then(data => {
        const productsData = data.products || data || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Failed to fetch products');
        setProducts([]); // Set empty array as fallback
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext); 