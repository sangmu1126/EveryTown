// Place_SearchPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';

function PlaceSearchPage() {
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
        return <div className="place-stars">{stars}</div>;
      };

    return (
        <div>
            <h1>플레이스 검색 결과</h1>
            <div className="place-list">
                {searchResults.map((place, index) => (
                    <div key={index} className="place-item" onClick={() => navigate(`/place/${place.id}`)}>
                        <div className="place-details">
                        <h2>{place.name}</h2>
                        <p>{place.categoryMiddleName}</p>
                        <p><div className='star-list'>{renderRating(place.rating)}</div> &nbsp; ({place.reviewCnt})</p>
                        <p>{place.dong}&nbsp;({place.distance}m)</p>
                        </div>
                        <div className="place-image">
                        <img src={place.image}/>
                        </div>
                    </div>
                    ))}
            </div>
        </div>
    );
}

export default PlaceSearchPage;
