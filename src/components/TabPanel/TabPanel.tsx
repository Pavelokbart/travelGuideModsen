import React, { useState } from 'react';
import './TabPanel.css';
import { Link } from 'react-router-dom';
import { LogoIcon } from '@Icons/LogoIcon';
import { SearchIcon } from '@Icons/SearchIcon';
import { FavoriteIcon } from '@Icons/FavoriteIcon';
import { SearchBtnIcon } from '@Icons/SearchBtnIcon';
import { GardenIcon } from '@Icons/GardenIcon';
import { ReligionIconForSearch } from '@Icons/ReligionIconForSearch';
import { MuseumIconForSearch } from '@Icons/MuseumIconForSearch';
import Favorite from '../Favorite/Favorite';
import { HistoricIconForSearch } from '@Icons/HistoricIconForSearch';
import { IndustrialIconForSearch } from '@Icons/IndustrialIconForSearch';
import { ArchitectureIconForSearch } from '@Icons/ArchitectureIconForSearch';
import { OtherIconForSearch } from '@Icons/otherIconForSearch';

interface TabPanelProps {
  setCategory: (category: string) => void;
  setRadius: (radius: number) => void;
  onSearch: (query: string) => void;
}

const categories = [
  { id: 'cultural', label: 'Cultural', Icon: MuseumIconForSearch },
  { id: 'natural', label: 'Natural', Icon: GardenIcon },
  { id: 'religion', label: 'Religion', Icon: ReligionIconForSearch },
  { id: 'historic', label: 'Historic', Icon: HistoricIconForSearch },
  {
    id: 'industrial_facilities',
    label: 'Industrial',
    Icon: IndustrialIconForSearch,
  },
  {
    id: 'architecture',
    label: 'Architecture',
    Icon: ArchitectureIconForSearch,
  },
  { id: 'other', label: 'Other', Icon: OtherIconForSearch },
];

const TabPanel: React.FC<TabPanelProps> = ({
  setCategory,
  setRadius,
  onSearch,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [radiusInKm, setRadiusInKm] = useState<string>('10');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFavoriteSidebar, setIsFavoriteSidebar] = useState(false);

  const toggleSidebar = (isFavorite: boolean) => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsFavoriteSidebar(isFavorite);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInKm = e.target.value;
    setRadiusInKm(valueInKm);
    const valueInMeters = parseInt(valueInKm, 10) * 1000;
    setRadius(valueInMeters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="tabpanel">
      <div className="tabpanel_logo">
        <LogoIcon />
      </div>
      <div className="tabpanel_btn">
        <button
          type="button"
          className="search_btn"
          onClick={() => toggleSidebar(false)}
        >
          <SearchIcon />
        </button>
        <button
          type="button"
          className="favorite-btn"
          onClick={() => toggleSidebar(true)}
        >
          <FavoriteIcon />
        </button>
      </div>
      <Link to="/auth">User</Link>

      {isSidebarOpen && (
        <div className="sidebar">
          <button
            type="button"
            className="close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✖
          </button>
          <div className="sidebar-content">
            {!isFavoriteSidebar ? (
              <>
                <input
                  className="search_input"
                  type="text"
                  placeholder="Место, адрес.."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <p>Искать:</p>
                <div className="category-list">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setCategory(category.id)}
                    >
                      <category.Icon />
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
                <div className="radius-input">
                  <div className="radius_txt">В Радиусе (км)</div>
                  <input
                    className="inputforkm"
                    type="text"
                    value={radiusInKm}
                    onChange={handleRadiusChange}
                  />
                </div>
                <button
                  type="button"
                  className="serach_button"
                  onClick={handleSearch}
                >
                  <SearchBtnIcon />
                </button>
              </>
            ) : (
              <>
                <div className="favorite">Избранное</div>
                <Favorite />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabPanel;
