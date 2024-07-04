import React, { useState } from 'react';
import './MapWithTab.css';
import TabPanel from '../TabPanel/TabPanel';
import Map from '../Map/Map';
import { MarkerData } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUserLocation } from '../../redux/userLocationSlice';
import { handleSearch } from '../../utils/apiUtils';

const MapWithTab: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const radius = useSelector((state: RootState) => state.radius.radius);
  const userLocation = useSelector(
    (state: RootState) => state.userLocation.location,
  );
  const [searchResult, setSearchResult] = useState<MarkerData | null>(null);
  const dispatch = useDispatch();

  const onSearch = async (query: string) => {
    if (!userLocation) {
      console.error('User location is not set');
      return;
    }

    const { lat, lng } = userLocation;
    const apiKey = '5ae2e3f221c38a28845f05b692c2b88ed6e6285f06ed260b57075108';
    const result = await handleSearch(query, lat, lng, radius, apiKey);

    setSearchResult(result);
  };

  return (
    <div className="map">
      <TabPanel setCategory={setCategory} onSearch={onSearch} />
      <Map
        category={category}
        radius={radius}
        searchResult={searchResult}
        userLocation={userLocation}
        setUserLocation={(loc) => dispatch(setUserLocation(loc))}
      />
    </div>
  );
};

export default MapWithTab;
