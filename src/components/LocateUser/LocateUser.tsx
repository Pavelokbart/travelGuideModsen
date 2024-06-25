import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateUserProps } from '../../types';

const LocateUser: React.FC<LocateUserProps> = ({ setUserLocation }) => {
  const map = useMap();

  useEffect(() => {
    map
      .locate({
        setView: true,
        maxZoom: 16,
        enableHighAccuracy: true,
      })
      .on('locationfound', (e: L.LocationEvent) => {
        const { lat, lng } = e.latlng;
        setUserLocation({ lat, lng });
        map.setView(e.latlng, 13);
        L.marker(e.latlng).addTo(map).bindPopup('You are here').openPopup();
      })
      .on('locationerror', (err) => {
        console.error('Location error:', err.message);
      });
  }, [map, setUserLocation]);

  return null;
};

export default LocateUser;
