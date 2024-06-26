import { LatLngExpression } from 'leaflet';
import polyline from '@mapbox/polyline';
import { Console } from 'console';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import {
  ApiResponse,
  UserLocation,
  MarkerData,
  DetailedPlaceInfo,
} from '../types';
import { IAttraction } from '../types';

const fetchMarkers = async (
  category: string,
  lat: number,
  lng: number,
  radius: number,
): Promise<MarkerData[]> => {
  let kinds = 'interesting_places';
  if (category === 'religion') kinds = 'religion';
  else if (category === 'cultural') kinds = 'cultural';
  else if (category === 'architecture') kinds = 'architecture';
  else if (category === 'natural') kinds = 'natural';
  else if (category === 'historic') kinds = 'historic';
  else if (category === 'industrial_facilities')
    kinds = 'industrial_facilities';
  else if (category === 'other') kinds = 'other';

  const apiKey = '5ae2e3f221c38a28845f05b692c2b88ed6e6285f06ed260b57075108';
  const response = await fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lng}&lat=${lat}&kinds=${kinds}&apikey=${apiKey}`,
  );
  const data: ApiResponse = await response.json();

  if (data && data.features) {
    return data.features.map((feature) => ({
      id: feature.id,
      name: feature.properties.name,
      position: [
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
      ] as LatLngExpression,
      category: feature.properties.kinds,
    }));
  }
  console.error('No features found in API response', data);
  return [];
};

const buildRoute = (
  userLocation: UserLocation | null,
  destination: LatLngExpression,
  callback: (distance: number, duration: number) => void,
  setRoute: (route: LatLngExpression[]) => void,
  setRouteInfo: (info: { distance: number; duration: number }) => void,
) => {
  if (!userLocation) return;

  const isLatLngTuple = (point: LatLngExpression): point is [number, number] =>
    Array.isArray(point) &&
    point.length === 2 &&
    typeof point[0] === 'number' &&
    typeof point[1] === 'number';

  if (!isLatLngTuple(destination)) {
    console.error('Destination is not a valid LatLng tuple');
    return;
  }

  const request = new XMLHttpRequest();

  request.open(
    'POST',
    'https://api.openrouteservice.org/v2/directions/foot-walking',
  );

  request.setRequestHeader(
    'Accept',
    'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
  );
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader(
    'Authorization',
    '5b3ce3597851110001cf62483c2c66866a324194a4152e0c1697bc49',
  );

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const data = JSON.parse(this.responseText);
        if (data && data.routes && data.routes.length > 0) {
          const { geometry } = data.routes[0];
          const routeCoords = polyline
            .decode(geometry)
            .map(
              (coord: [number, number]) =>
                [coord[0], coord[1]] as LatLngExpression,
            );
          setRoute(routeCoords);
          const { distance, duration } = data.routes[0].summary;
          setRouteInfo({ distance, duration });
          callback(distance, duration);
        }
      } else {
        console.error('Failed to fetch route', this.responseText);
      }
    }
  };

  const body = JSON.stringify({
    coordinates: [
      [userLocation.lng, userLocation.lat],
      [destination[1], destination[0]],
    ],
  });

  request.send(body);
};

const fetchPlaceDetails = async (
  xid: string,
): Promise<DetailedPlaceInfo | null> => {
  const apiKey = '5ae2e3f221c38a28845f05b692c2b88ed6e6285f06ed260b57075108';
  const response = await fetch(
    `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${apiKey}`,
  );
  const data = await response.json();
  console.log(data);

  if (data) {
    return {
      name: data.name,
      description: data.info?.descr,
      image: data.image,
      wikipedia: data.wikipedia,
      address: data.address?.road
        ? `${data.address.road}, ${data.address.house_number} ${data.address.city}`
        : data.address?.city,
    };
  }
  console.error('No detailed information found for xid', xid);
  return null;
};

const getUserFavoritesRef = (userId: string) => doc(db, 'favorites', userId);

export const addAttractionToFavorites = async (
  userId: string,
  attraction: IAttraction,
) => {
  try {
    const { id, name, position } = attraction; // Деструктурируем attraction, чтобы получить необходимые поля
    const userFavoritesRef = getUserFavoritesRef(userId);
    const userFavoritesSnap = await getDoc(userFavoritesRef);

    if (!userFavoritesSnap.exists()) {
      await setDoc(userFavoritesRef, { attractions: [{ id, name, position }] }); // Сохраняем все поля аттракции, включая position
    } else {
      const attractions = userFavoritesSnap.data().attractions || [];
      const existingAttractionIndex = attractions.findIndex(
        (item: IAttraction) => item.id === attraction.id,
      );
      if (existingAttractionIndex > -1) {
        // Если аттракция уже существует, ничего не делаем или обрабатываем соответствующим образом
      } else {
        await updateDoc(userFavoritesRef, {
          attractions: arrayUnion({ id, name, position }), // Добавляем аттракцию в массив, если она еще не существует
        });
      }
    }
  } catch (error) {
    console.error('Error adding attraction to favorites:', error);
    throw error;
  }
};
export const getFavorites = async (userId: string) => {
  try {
    const userFavoritesRef = doc(db, 'favorites', userId);
    const userFavoritesSnap = await getDoc(userFavoritesRef);

    if (userFavoritesSnap.exists()) {
      return userFavoritesSnap.data().attractions || [];
    } else {
      console.log('No such document!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export { fetchMarkers, buildRoute, fetchPlaceDetails };
