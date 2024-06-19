import React, { useState } from 'react';
import { Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import './MarkerPopup.css';
import { MarkerPopupProps } from '../../types';

const MarkerPopup: React.FC<MarkerPopupProps> = ({ name, position, buildRoute }) => {
  const [routeDetails, setRouteDetails] = useState<{ distance: number; duration: number } | null>(null);

  const handleBuildRoute = () => {
    buildRoute(position, (distance, duration) => {
      setRouteDetails({ distance, duration });
    });
  };

  return (
    <Popup>
      <div className="popup-content">
        
        <strong>{name}</strong>
        <br />
        <button onClick={handleBuildRoute} className="popup-button">
          Build Route
        </button>
        {routeDetails && (
          <div className="route-details">
            <p>Distance: {(routeDetails.distance / 1000).toFixed(2)} km</p>
            <p>Duration: {Math.ceil(routeDetails.duration / 60)} minutes</p>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default MarkerPopup;
