// Food_SearchPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';

function FoodSearchPage() {
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.searchResults) {
            setSearchResults(location.state.searchResults);
        }
    }, [location.state]);

    const renderRating = (rating) => {
        const totalStars = 5;
        let stars = [];
        for (let i = 0; i < totalStars; i++) {
          stars.push(
            <Icon type={i < rating ? 'star_full' : 'star_empty'} key={i} />
          );
        }
        return <div className="restaurant-stars">{stars}</div>;
      };

    return (
        <div>
            <h1>음식점 검색 결과</h1>
            <div className="restaurant-list">
                {searchResults.map((restaurant, index) => (
                    <div key={index} className="restaurant-item" onClick={() => navigate(`/food/${restaurant.id}`)}>
                        <div className="restaurant-details">
                        <h2>{restaurant.name}</h2>
                        <p>{restaurant.categoryMiddleName}</p>
                        <p><div className='star-list'>{renderRating(restaurant.rating)}</div> &nbsp; ({restaurant.reviewCnt})</p>
                        <p>{restaurant.dong}&nbsp;({restaurant.distance}m)</p>
                        </div>
                        <div className="restaurant-image">
                        <img src={restaurant.image}/>
                        </div>
                    </div>
                    ))}
            </div>
        </div>
    );
}

export default FoodSearchPage;
