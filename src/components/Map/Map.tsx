import React, { useEffect, useState, useRef } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setRoute, setRouteInfo, clearRoute } from '../../redux/routeSlice';
import { RootState } from '../../redux/store';
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

const Map: React.FC<
  MapProps & {
    searchResult: MarkerData | null;
    userLocation: UserLocation | null;
    setUserLocation: (loc: UserLocation) => void;
  }
> = ({ category, radius, searchResult, userLocation, setUserLocation }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const route = useSelector((state: RootState) => state.route.route);
  const routeInfo = useSelector((state: RootState) => state.route.routeInfo);
  const dispatch = useDispatch();
  const searchMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (userLocation) {
      fetchMarkers(category, userLocation.lat, userLocation.lng, radius).then(
        setMarkers,
      );
    }
  }, [category, userLocation, radius]);

  useEffect(() => {
    if (searchResult && searchMarkerRef.current) {
      searchMarkerRef.current.openPopup();
    }
  }, [searchResult]);

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

  const clearRouteHandler = () => {
    dispatch(clearRoute());
  };

  const getHighestPriorityCategory = (categories: string) => {
    const categoryList = categories.split(',');
    for (let i = 0; i < categoryPriority.length; i++) {
      if (categoryList.includes(categoryPriority[i])) {
        return categoryPriority[i];
      }
    }
    return 'other';
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
            clearRoute={clearRouteHandler}
            buildRoute={(destination, callback) =>
              buildRoute(
                userLocation,
                destination,
                callback,
                (route) => dispatch(setRoute(route)),
                (info) => dispatch(setRouteInfo(info)),
              )
            }
          />
        </Marker>
      ))}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
      {searchResult && (
        <Marker
          position={searchResult.position}
          ref={(ref) => {
            searchMarkerRef.current = ref;
            if (ref) {
              ref.openPopup();
            }
          }}
        >
          <MarkerPopup
            name={searchResult.name}
            position={searchResult.position}
            buildRoute={(destination, callback) =>
              buildRoute(
                userLocation,
                destination,
                callback,
                (route) => dispatch(setRoute(route)),
                (info) => dispatch(setRouteInfo(info)),
              )
            }
            xid={searchResult.id}
            clearRoute={clearRouteHandler}
          />
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
