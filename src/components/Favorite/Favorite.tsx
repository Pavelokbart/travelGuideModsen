import './Favorite.css';
import React from 'react';
import { IAttraction } from '../../types';
import { auth } from '../../firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import { getFavorites } from '../../utils/apiUtils';

const Favorite = () => {
  const [favorites, setFavorites] = useState<IAttraction[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const attractions = await getFavorites(userId);
        setFavorites(attractions);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="favorite-container">
      {favorites.map((attraction) => (
        <div key={attraction.id} className="favoriteblock">
          <div className="favoriteblock_name">{attraction.name}</div>

          <div className="favoriteblock_buttons">
            <button className="delete_button">Icon</button>
            <button className="detail_button" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favorite;
