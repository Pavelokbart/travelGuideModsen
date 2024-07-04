import './Favorite.css';
import React, { useState, useEffect } from 'react';
import { IAttraction, UserLocation } from '../../types';
import { auth } from '../../firebase';
import { getFavorites, buildRoute } from '@utils/apiUtils';
import { LatLngExpression } from 'leaflet';
import { removeAttractionFromFavorites } from '@utils/apiUtils';
import { useDispatch, useSelector } from 'react-redux';
import { setRoute, setRouteInfo } from '../../redux/routeSlice';
import { RootState } from '../../redux/store';
import { FavoriteSmall } from '@Icons/FavoriteSmall';
import { Pointer } from '@Icons/Pointer';

const Favorite = () => {
  const [favorites, setFavorites] = useState<IAttraction[]>([]);
  const userLocation = useSelector(
    (state: RootState) => state.userLocation.location,
  );
  const dispatch = useDispatch();

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
          dispatch(setRouteInfo({ distance, duration }));
        },
        (route) => {
          dispatch(setRoute(route));
        },
        (info) => {
          console.log('Route Info:', info);
        },
      );
    }
  };

  const handleRemoveFavorite = async (attraction: IAttraction) => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      try {
        await removeAttractionFromFavorites(userId, attraction);
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.id !== attraction.id),
        );
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    }
  };

  return (
    <div className="favorite-container">
      {favorites.map((attraction) => (
        <div key={attraction.id} className="favoriteblock">
          <div className="favoriteblock_name">{attraction.name}</div>
          <div className="favoriteblock_buttons">
            <button
              className="favorite_button"
              onClick={() => handleRemoveFavorite(attraction)}
            >
              <FavoriteSmall />
            </button>
            <button
              className="build_button"
              onClick={() => handleBuildRoute(attraction)}
            >
              <Pointer />
              Build Route
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favorite;
