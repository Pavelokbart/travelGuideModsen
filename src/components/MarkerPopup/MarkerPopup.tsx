// В файл MarkerPopup.tsx
import React, { useState } from 'react';
import { Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import './MarkerPopup.css';
import { MarkerPopupProps } from '../../types';
import DetailedInfo from '../DetailedInfo/DetailedInfo';

const MarkerPopup: React.FC<MarkerPopupProps> = ({ name, position, xid, buildRoute }) => {
  const [routeDetails, setRouteDetails] = useState<{ distance: number; duration: number } | null>(null);
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

  return (
    <Popup>
      <div className="popup-content">
        <strong>{name}</strong>
        <br />
        <button onClick={handleBuildRoute} className="popup-button">Build Route</button>
        <button onClick={handleShowDetails} className="popup-button">Show Details</button>
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
