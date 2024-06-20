import './Favorite.css';

const Favorite = () => {
  return(
    <div className="favoriteblock">
        <div className="favoriteblock_name">Фантаcмагарический музей им. П.М. Машерова</div>
        <div className="favoriteblock_address">Сурганаво 37</div>
        <div className="favoriteblock_buttons">
            <button className="favorite_button">Icon</button>
            <button className="detail_button"></button>
        </div>

    </div>
  )
};

export default Favorite;