// src/components/TabPanel/TabPanel.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setRadius } from '../../redux/radiusSlice';
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
import { UserIcon } from '@Icons/UserIcon';
import { SearchIconInput } from '@Icons/SearchIconInput';

interface TabPanelProps {
  setCategory: (category: string) => void;
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

const TabPanel: React.FC<TabPanelProps> = ({ setCategory, onSearch }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFavoriteSidebar, setIsFavoriteSidebar] = useState(false);

  const dispatch = useDispatch();
  const radiusInKm = useSelector(
    (state: RootState) => state.radius.radius / 1000,
  );

  const toggleSidebar = (isFavorite: boolean) => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsFavoriteSidebar(isFavorite);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInKm = e.target.value;
    dispatch(setRadius(parseInt(valueInKm, 10) * 1000));
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
      <div className="tabpanel_spacer" />
      <Link to="/auth" className="tabpanel_user">
        <UserIcon />
      </Link>
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
                <div className="input-container">
                  <div className="input-icon">
                    <SearchIconInput />
                  </div>
                  <input
                    className="search_input"
                    type="text"
                    placeholder="Место, адрес.."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="sidebar_find">Искать</div>
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
                    value={radiusInKm.toString()}
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
