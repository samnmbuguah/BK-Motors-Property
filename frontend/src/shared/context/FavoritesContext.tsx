import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favoriteCarIds: (string | number)[];
  favoritePropertyIds: (string | number)[];
  toggleFavoriteCar: (id: string | number) => void;
  isCarFavorite: (id: string | number) => boolean;
  toggleFavoriteProperty: (id: string | number) => void;
  isPropertyFavorite: (id: string | number) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteCarIds, setFavoriteCarIds] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem('bk_fav_cars');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoritePropertyIds, setFavoritePropertyIds] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem('bk_fav_props');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bk_fav_cars', JSON.stringify(favoriteCarIds));
  }, [favoriteCarIds]);

  useEffect(() => {
    localStorage.setItem('bk_fav_props', JSON.stringify(favoritePropertyIds));
  }, [favoritePropertyIds]);

  const toggleFavoriteCar = (id: string | number) => {
    setFavoriteCarIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isCarFavorite = (id: string | number) => favoriteCarIds.includes(id);

  const toggleFavoriteProperty = (id: string | number) => {
    setFavoritePropertyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isPropertyFavorite = (id: string | number) => favoritePropertyIds.includes(id);

  const totalFavorites = favoriteCarIds.length + favoritePropertyIds.length;

  return (
    <FavoritesContext.Provider
      value={{
        favoriteCarIds,
        favoritePropertyIds,
        toggleFavoriteCar,
        isCarFavorite,
        toggleFavoriteProperty,
        isPropertyFavorite,
        totalFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
