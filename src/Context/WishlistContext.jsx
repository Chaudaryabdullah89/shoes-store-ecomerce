import React, { useEffect, useState } from "react";
import { WishlistContext } from "./WishlistContextProvider";
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './useAuth';

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist from backend if logged in, else from localStorage
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      if (user && token) {
        try {
          const res = await wishlistService.getWishlist();
          setWishlist(res.wishlist?.items || []);
        } catch {
          setWishlist([]);
        }
      } else {
        const stored = localStorage.getItem("wishlist");
        setWishlist(stored ? JSON.parse(stored) : []);
      }
      setLoading(false);
    };
    fetchWishlist();
    // eslint-disable-next-line
  }, [user, token]);

  // Sync localStorage for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  // Add to wishlist
  const addToWishlist = async (product) => {
    if (user && token) {
      try {
        await wishlistService.addToWishlist(product._id || product.id);
        const res = await wishlistService.getWishlist();
        setWishlist(res.wishlist?.items || []);
      } catch {
        // Optionally handle error (e.g., toast.error('Failed to add to wishlist'))
      }
    } else {
      setWishlist((prev) => {
        if (prev.find((item) => item.id === product.id)) return prev;
        return [...prev, product];
      });
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (id) => {
    if (user && token) {
      try {
        await wishlistService.removeFromWishlist(id);
        const res = await wishlistService.getWishlist();
        setWishlist(res.wishlist?.items || []);
      } catch {
        // Optionally handle error (e.g., toast.error('Failed to remove from wishlist'))
      }
    } else {
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (id) => {
    return wishlist.some((item) => item._id === id || item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}; 