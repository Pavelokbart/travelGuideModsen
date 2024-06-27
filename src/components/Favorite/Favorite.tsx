import './Favorite.css';
import React, { useState, useEffect } from 'react';
import { IAttraction, UserLocation } from '../../types';
import { auth } from '../../firebase';
import { getFavorites, buildRoute } from '../../utils/apiUtils';
import { LatLngExpression } from 'leaflet';

const Favorite = () => {
  const [favorites, setFavorites] = useState<IAttraction[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  // Fetch user favorites
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

  useEffect(() => {
    const locateUser = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error('Error fetching user location:', error);
          },
          { enableHighAccuracy: true },
        );
      }
    };

    locateUser();
  }, []);

  const handleBuildRoute = async (attraction: IAttraction) => {
    if (userLocation) {
      buildRoute(
        userLocation,
        attraction.position,
        (distance, duration) => {
          setRouteInfo({ distance, duration });
        },
        (route) => {
          setRoute(route);
        },
        (info) => {
          console.log('Route Info:', info);
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
            <button
              className="build_button"
              onClick={() => handleBuildRoute(attraction)}
            >
              Build Route
            </button>
          </div>
        </div>
      ))}

      {routeInfo && (
        <div className="route-details">
          <p>Distance: {(routeInfo.distance / 1000).toFixed(2)} km</p>
          <p>Duration: {Math.ceil(routeInfo.duration / 60)} minutes</p>
        </div>
      )}
    </div>
  );
};

export default Favorite;
