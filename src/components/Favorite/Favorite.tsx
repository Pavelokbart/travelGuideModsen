import './Favorite.css';
import React from 'react';
import { IAttraction } from '../../types';
import { auth } from '../../firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import { getFavorites } from '../../utils/apiUtils';
import { buildRoute } from '../../utils/apiUtils';

const Favorite = () => {
  const [favorites, setFavorites] = useState<IAttraction[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [routeDetails, setRouteDetails] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

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

  const handleBuildRoute = async (attraction: IAttraction) => {
    if (userLocation) {
      buildRoute(
        userLocation,
        attraction.position,
        (distance, duration) => {
          setRouteDetails({ distance, duration });
        },
        (route) => {
          console.log('Route:', route); // Здесь можно сохранить маршрут в Firestore
        },
        (info) => {
          console.log('Route Info:', info); // Здесь можно сохранить информацию о маршруте в Firestore
        },
      );
    }
  };

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
