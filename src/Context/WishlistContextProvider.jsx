import { createContext, useContext } from "react";

export const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext); 