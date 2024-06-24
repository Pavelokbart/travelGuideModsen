import React, { useState } from 'react';
import './MapWithTab.css';
import TabPanel from '../TabPanel/TabPanel';
import Map from '../Map/Map';
import { MarkerData } from '../../types';


const MapWithTab: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const [radius, setRadius] = useState<number>(10000); // Начальное значение радиуса
  const [searchResult, setSearchResult] = useState<MarkerData | null>(null); // Новый стейт для результата поиска

  const handleSearch = async (query: string) => {
    const apiKey = '5ae2e3f221c38a28845f05b692c2b88ed6e6285f06ed260b57075108'; 
    const response = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${query}&apikey=${apiKey}`);
    
    const data = await response.json();
    console.log('find')

    console.log(data)
    if (data) {
      const searchMarker: MarkerData = {
        id: data.xid,
        name: data.name,
        position: [data.lat, data.lon],
        category: data.kinds,
      };
      setSearchResult(searchMarker);
    }
  };

  return (
    <div className="map">
      <TabPanel setCategory={setCategory} setRadius={setRadius} onSearch={handleSearch} />
      <Map category={category} radius={radius} searchResult={searchResult} />
    </div>
  );
};

export default MapWithTab;
