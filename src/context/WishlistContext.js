import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const localWishlist = localStorage.getItem('edusphere_wishlist');
    return localWishlist ? JSON.parse(localWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('edusphere_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (courseId) => {
    if (!wishlist.includes(courseId)) {
      setWishlist(prev => [...prev, courseId]);
    }
  };

  const removeFromWishlist = (courseId) => {
    setWishlist(prev => prev.filter(id => id !== courseId));
  };

  const toggleWishlist = (courseId) => {
    if (wishlist.includes(courseId)) {
      removeFromWishlist(courseId);
    } else {
      addToWishlist(courseId);
    }
  };

  const inWishlist = (courseId) => {
    return wishlist.includes(courseId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      inWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
