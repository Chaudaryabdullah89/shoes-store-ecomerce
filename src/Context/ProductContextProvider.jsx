import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';

const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    productService.getProducts()
      .then(data => setProducts(data.products || data))
      .catch(err => setError(err.message || 'Failed to fetch products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext); 