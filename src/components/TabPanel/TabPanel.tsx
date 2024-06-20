import React, { useState } from 'react';
import './TabPanel.css';
import { LogoIcon } from '../../Icons/LogoIcon';
import { SearchIcon } from '../../Icons/SearchIcon';
import { FavoriteIcon } from '../../Icons/FavoriteIcon';
import { SearchBtnIcon } from '../../Icons/SearchBtnIcon';
import { GardenIcon } from '../../Icons/GardenIcon';
import { ReligionIconForSearch } from '../../Icons/ReligionIconForSearch';
import { MuseumIconForSearch } from '../../Icons/MuseumIconForSearch';

interface TabPanelProps {
  setCategory: (category: string) => void;
  setRadius: (radius: number) => void;
}

const TabPanel: React.FC<TabPanelProps> = ({ setCategory, setRadius }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [radiusInKm, setRadiusInKm] = useState<string>('10'); // Initial radius value in kilometers

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInKm = e.target.value;
    setRadiusInKm(valueInKm);
    const valueInMeters = parseInt(valueInKm, 10) * 1000; // Convert kilometers to meters
    setRadius(valueInMeters); // Update radius in meters
  };

  return (
    <div className='tabpanel'>
      <div className="tabpanel_logo"><LogoIcon/></div>
      <div className="tabpanel_btn">
        <button className='search_btn' onClick={toggleSidebar}><SearchIcon/></button>
        <button className='favorite-btn'><FavoriteIcon/></button>
      </div>
      {isSidebarOpen && (
        <div className="sidebar">
          <button className="close-btn" onClick={toggleSidebar}>✖</button>
          <div className="sidebar-content">
            <input className='search_input' type="text" placeholder="Место, адрес.." />
            <p>Искать:</p>
            <div className="category-list">
              
              <button onClick={() => setCategory('museums')}><MuseumIconForSearch/><span>Museums</span></button>
              <button onClick={() => setCategory('parks')}><GardenIcon/><span>Parks</span></button>
              <button onClick={() => setCategory('religion')}><ReligionIconForSearch/><span>religion</span></button>
              
            </div>


            {/* <select onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All</option>
              <option value="museums">Museums</option>
              <option value="parks">Parks</option>
              <option value="religion">Religion</option>
            </select> */}
          </div>
          <div className="radius-input">
            <div className="radius_txt">В Радиусе (км)</div>
            <input className='inputforkm' type="text" placeholder="" value={radiusInKm} onChange={handleRadiusChange} />
          </div>

        
             <button className='serach_button'><SearchBtnIcon/></button>
          
        </div>

        
      )}
    </div>
  );
};

export default TabPanel;
