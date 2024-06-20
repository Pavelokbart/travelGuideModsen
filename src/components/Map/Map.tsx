// В файл Map.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { LocateUserProps, MarkerData, UserLocation } from '../../types';
import polyline from '@mapbox/polyline';
import MarkerPopup from '../MarkerPopup/MarkerPopup';
import { ApiResponse } from '../../types';
import LocateUser from '../LocateUser/LocateUser';
import museumIconSvg from '../../Icons/museumIcon';
import religionIconSvg from '../../Icons/religionIcon';
import parkIconSvg from '../../Icons/parkIcon';
import { MapProps } from '../../types';
import { fetchMarkers, buildRoute } from '../../utils/apiUtils';
import { DefaultIcon, CustomIcon } from '../../utils/iconUtils';

L.Marker.prototype.options.icon = DefaultIcon;

const Map: React.FC<MapProps> = ({ category, radius }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: number, duration: number } | null>(null);

  useEffect(() => {
    if (userLocation) {
      fetchMarkers(category, userLocation.lat, userLocation.lng, radius).then(setMarkers);
    }
  }, [category, userLocation, radius]);

  const getIconForCategory = (category: string) => {
    if (category.includes('museums')) return CustomIcon(museumIconSvg);
    if (category.includes('gardens_and_parks')) return CustomIcon(parkIconSvg);
    if (category.includes('religion')) return CustomIcon(religionIconSvg);
    return DefaultIcon;
  };

  return (
    <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <LocateUser setUserLocation={setUserLocation} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position} icon={getIconForCategory(marker.category)}>
          <MarkerPopup 
            name={marker.name} 
            position={marker.position} 
            xid={marker.id} // Передача xid
            buildRoute={(destination, callback) => buildRoute(userLocation, destination, callback, setRoute, setRouteInfo)}
          />
        </Marker>
      ))}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default Map;
