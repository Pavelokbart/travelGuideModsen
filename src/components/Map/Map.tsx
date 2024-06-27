import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
} from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { MarkerData, UserLocation, MapProps } from '../../types';
import MarkerPopup from '../MarkerPopup/MarkerPopup';
import LocateUser from '../LocateUser/LocateUser';
import museumIconSvg from '../../Icons/museumIcon';
import religionIconSvg from '../../Icons/religionIcon';
import parkIconSvg from '../../Icons/parkIcon';

import { fetchMarkers, buildRoute } from '../../utils/apiUtils';
import { DefaultIcon, CustomIcon } from '../../utils/iconUtils';
import historicIconSvg from '../../Icons/historicIcon';
import industrialIconSvg from '../../Icons/industialIcon';
import architectureIconSvg from '../../Icons/architectureIcon';
import otherIconSvg from '../../Icons/otherIcon';

L.Marker.prototype.options.icon = DefaultIcon;

const Map: React.FC<MapProps & { searchResult: MarkerData | null }> = ({
  category,
  radius,
  searchResult,
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  useEffect(() => {
    if (userLocation) {
      fetchMarkers(category, userLocation.lat, userLocation.lng, radius).then(
        setMarkers,
      );
    }
  }, [category, userLocation, radius]);

  const categoryPriority = [
    'cultural',
    'natural',
    'religion',
    'historic',
    'architecture',

    'industrial_facilities',
    'natural',

    'other',
  ];
  const clearRoute = () => {
    setRoute([]);
    setRouteInfo(null);
  };

  const getHighestPriorityCategory = (categories: string) => {
    const categoryList = categories.split(',');
    for (let i = 0; i < categoryPriority.length; i++) {
      if (categoryList.includes(categoryPriority[i])) {
        return categoryPriority[i];
      }
    }
    return 'other'; // default category if none match
  };

  const getIconForCategory = (categoryString: string) => {
    const highestPriorityCategory = getHighestPriorityCategory(categoryString);

    if (highestPriorityCategory === 'historic') {
      return CustomIcon(historicIconSvg);
    }
    if (highestPriorityCategory === 'industrial_facilities') {
      return CustomIcon(industrialIconSvg);
    }
    if (highestPriorityCategory === 'architecture') {
      return CustomIcon(architectureIconSvg);
    }

    if (highestPriorityCategory === 'cultural') {
      return CustomIcon(museumIconSvg);
    }
    if (highestPriorityCategory === 'natural') return CustomIcon(parkIconSvg);
    if (highestPriorityCategory === 'religion') {
      return CustomIcon(religionIconSvg);
    }

    if (highestPriorityCategory === 'other') return CustomIcon(otherIconSvg);

    return DefaultIcon;
  };

  return (
    <MapContainer
      center={
        userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09]
      }
      zoom={40}
      style={{ height: '100%', width: '100%' }}
    >
      <LocateUser setUserLocation={setUserLocation} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {userLocation && radius && (
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={radius}
          color="blue"
        />
      )}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={getIconForCategory(marker.category)}
        >
          <MarkerPopup
            name={marker.name}
            position={marker.position}
            xid={marker.id}
            clearRoute={clearRoute} // Передача xid
            buildRoute={(destination, callback) =>
              buildRoute(
                userLocation,
                destination,
                callback,
                setRoute,
                setRouteInfo,
              )
            }
          />
        </Marker>
      ))}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
      {searchResult && (
        <Marker position={searchResult.position}>
          <MarkerPopup
            name={searchResult.name}
            position={searchResult.position}
            buildRoute={() => {}}
            xid={searchResult.id}
            clearRoute={clearRoute}
          />
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
