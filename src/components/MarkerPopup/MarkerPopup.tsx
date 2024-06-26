import React, { useState } from 'react';
import { Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import './MarkerPopup.css';
import { MarkerPopupProps } from '../../types';
import DetailedInfo from '../DetailedInfo/DetailedInfo';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { addAttractionToFavorites } from '../../utils/apiUtils';
import { auth } from '../../firebase';

const MarkerPopup: React.FC<MarkerPopupProps> = ({
  name,
  position,
  xid,
  buildRoute,
  clearRoute,
}) => {
  const [routeDetails, setRouteDetails] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleBuildRoute = () => {
    buildRoute(position, (distance, duration) => {
      setRouteDetails({ distance, duration });
    });
  };

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleClearRoute = () => {
    clearRoute();
    setRouteDetails(null);
  };

  const handleAddToFavorites = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const attraction = {
        id: xid,
        name,
        position,
      };
      await addAttractionToFavorites(userId, attraction);
      alert('Attraction added to favorites!');
    } else {
      alert('You need to log in to add favorites');
    }
  };

  return (
    <Popup>
      <div className="popup-content">
        <strong>{name}</strong>
        <br />
        <button onClick={handleBuildRoute} className="popup-button">
          Build Route
        </button>
        <button onClick={handleShowDetails} className="popup-button">
          Show Details
        </button>
        <button onClick={handleAddToFavorites} className="popup-button">
          Add to Favorite
        </button>
        <button onClick={handleClearRoute} className="popup-button">
          Clear Route
        </button>
        {routeDetails && (
          <div className="route-details">
            <p>Distance: {(routeDetails.distance / 1000).toFixed(2)} km</p>
            <p>Duration: {Math.ceil(routeDetails.duration / 60)} minutes</p>
          </div>
        )}
        {showDetails && <DetailedInfo xid={xid} onClose={handleCloseDetails} />}
      </div>
    </Popup>
  );
};

export default MarkerPopup;
