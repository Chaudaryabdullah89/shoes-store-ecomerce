import { createContext, useContext } from "react";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext); 