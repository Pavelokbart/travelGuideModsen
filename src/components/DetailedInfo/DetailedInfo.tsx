import React, { useEffect, useState } from 'react';

import { DetailedPlaceInfoProps, DetailedPlaceInfo } from '../../types';
import { fetchPlaceDetails } from '../../utils/apiUtils';
import './DetailedInfo.css';

const DetailedInfo: React.FC<DetailedPlaceInfoProps> = ({ xid, onClose }) => {
  const [placeInfo, setPlaceInfo] = useState<DetailedPlaceInfo | null>(null);

  useEffect(() => {
    fetchPlaceDetails(xid).then(setPlaceInfo);
  }, [xid]);

  if (!placeInfo) return <div>Loading...</div>;
  console.log(placeInfo);

  return (
    <div className="detailed-info">
      <button onClick={onClose}>Close</button>
      <h2>{placeInfo.name}</h2>
      {placeInfo.image && <img src={placeInfo.image} alt={placeInfo.name} />}
      <p>{placeInfo.description}</p>
      {placeInfo.address && (
        <p>
          <strong>Address:</strong> {placeInfo.address}
        </p>
      )}
      {placeInfo.wikipedia && (
        <a href={placeInfo.wikipedia} target="_blank" rel="noopener noreferrer">
          Read more on Wikipedia
        </a>
      )}
    </div>
  );
};

export default DetailedInfo;
