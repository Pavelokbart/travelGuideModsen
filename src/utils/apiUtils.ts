import { LatLngExpression } from 'leaflet';
import polyline from '@mapbox/polyline';
import { ApiResponse } from '../types';
import { UserLocation } from '../types';
import { MarkerData } from '../types';
import { DetailedPlaceInfo } from '../types';
import { Console } from 'console';

const fetchMarkers = async (category: string, lat: number, lng: number, radius: number): Promise<MarkerData[]> => {
  let kinds = 'interesting_places';
   if (category === 'religion') kinds = 'religion';
  else if (category === 'cultural') kinds = 'cultural';
  
  else if (category === 'architecture') kinds = 'architecture';
  else if (category === 'natural') kinds = 'natural';
  
  else if (category === 'historic') kinds = 'historic';
  else if (category === 'industrial_facilities') kinds = 'industrial_facilities';
  else if (category === 'architecture') kinds = 'architecture';
  else if (category === 'other') kinds = 'other';
  
  
  const apiKey = '5ae2e3f221c38a28845f05b692c2b88ed6e6285f06ed260b57075108';
  const response = await fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lng}&lat=${lat}&kinds=${kinds}&apikey=${apiKey}`);
  const data: ApiResponse = await response.json();

  console.log(data.features)
  if (data && data.features) {
    return data.features.map((feature) => ({
      id: feature.id,
      name: feature.properties.name,
      position: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] as LatLngExpression,
      category: feature.properties.kinds,
    }));
  } else {
    console.error('No features found in API response', data);
    return [];
  }
  

};

const buildRoute = (userLocation: UserLocation | null, destination: LatLngExpression, callback: (distance: number, duration: number) => void, setRoute: (route: LatLngExpression[]) => void, setRouteInfo: (info: { distance: number, duration: number }) => void) => {
  if (!userLocation) return;

  const isLatLngTuple = (point: LatLngExpression): point is [number, number] => 
    Array.isArray(point) && point.length === 2 && typeof point[0] === 'number' && typeof point[1] === 'number';

  if (!isLatLngTuple(destination)) {
    console.error("Destination is not a valid LatLng tuple");
    return;
  }

  const request = new XMLHttpRequest();

  request.open('POST', "https://api.openrouteservice.org/v2/directions/foot-walking"); 

  request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Authorization', '5b3ce3597851110001cf62483c2c66866a324194a4152e0c1697bc49');

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const data = JSON.parse(this.responseText);
        if (data && data.routes && data.routes.length > 0) {
          const geometry = data.routes[0].geometry;
          const routeCoords = polyline.decode(geometry).map((coord: [number, number]) => [coord[0], coord[1]] as LatLngExpression);
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
      [destination[1], destination[0]]
    ]
  });

  request.send(body);
};

const fetchPlaceDetails = async (xid: string): Promise<DetailedPlaceInfo | null> => {
  const apiKey = '5ae2e3f221c38a28845f05b692c2b88ed6e6285f06ed260b57075108';
  const response = await fetch(`https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${apiKey}`);
  const data = await response.json();
  console.log(data);

  if (data) {
    return {
      name: data.name,
      description: data.info?.descr,
      image: data.image,
      wikipedia: data.wikipedia,
      address: data.address?.road ? `${data.address.road}, ${data.address.house_number} ${data.address.city}` : data.address?.city,
    };
  } else {
    console.error('No detailed information found for xid', xid);
    return null;
  }
};

export { fetchMarkers, buildRoute,fetchPlaceDetails };
