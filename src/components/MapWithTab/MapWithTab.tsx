import React, { useState } from 'react';
import './MapWithTab.css';
import TabPanel from '../TabPanel/TabPanel';
import Map from '../Map/Map';
import { MarkerData, UserLocation } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const MapWithTab: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const radius = useSelector((state: RootState) => state.radius.radius);
  const [searchResult, setSearchResult] = useState<MarkerData | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const handleSearch = async (query: string) => {
    if (!userLocation) {
      console.error('User location is not set');
      return;
    }

    const { lat, lng } = userLocation;
    const apiKey = '5ae2e3f221c38a28845f05b692c2b88ed6e6285f06ed260b57075108';
    const response = await fetch(
      `https://api.opentripmap.com/0.1/ru/places/autosuggest?name=${query}&radius=${radius}&lon=${lng}&lat=${lat}&apikey=${apiKey}`,
    );

    const data = await response.json();
    console.log('find');

    console.log(data);
    if (data && data.features && data.features.length > 0) {
      const feature = data.features[0];
      const searchMarker: MarkerData = {
        id: feature.properties.xid,
        name: feature.properties.name,
        position: [
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ],
        category: feature.properties.kinds,
      };
      setSearchResult(searchMarker);
    } else {
      setSearchResult(null);
    }
  };

  return (
    <div className="map">
      <TabPanel setCategory={setCategory} onSearch={handleSearch} />
      <Map
        category={category}
        radius={radius}
        searchResult={searchResult}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
      />
    </div>
  );
};

export default MapWithTab;
