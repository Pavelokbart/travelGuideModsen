import React, { useState } from 'react';
import { Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import './MapWithTab.css';
import { MarkerPopupProps } from '../../types';
import TabPanel from '../TabPanel/TabPanel';
import Map from '../Map/Map';



const MapWithTab=  () => {
    const [category, setCategory] = useState<string>('all');
  const [radius, setRadius] = useState<number>(10000); // Initial radius value
  

  return (
    <div className="map">
        <TabPanel setCategory={setCategory} setRadius={setRadius} />
        <Map category={category} radius={radius} />
        
    </div>
    
  );
};

export default MapWithTab;
