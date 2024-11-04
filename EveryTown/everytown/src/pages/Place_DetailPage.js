// Place_DetailPage.js
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar'; 
import './Place_DetailPage.css';
import LocationInfo from '../components/LocationInfo';
import axios from 'axios';
import { LocationContext } from '../components/LocationContext';


function Place_DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { location } = useContext(LocationContext);
  const [placeData, setPlaceData] = useState({
    id:null,
    name:null,
    categoryLargeName:null,
    categoryMiddleName:null,
    categorySmallName:null,
    tag:null,
    dong:null,
    address:null,
    latitude:null,
    longitude:null,
    rating:null,
    distance:null,
    reviewCnt:null,
    image:null
  });
  const [menuData, setMenuData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const mapContainer = useRef(null);
 
  useEffect(() => {
    // 서버로부터 플레이스 상세 정보를 가져옵니다.
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/place/${id}/basicInfo`, {
         
        params: {
            lat: location.lat,
            lon: location.lon,
          }
        });
        setPlaceData(response.data);
        const options = {
          center: new window.kakao.maps.LatLng(response.data.latitude, response.data.longitude),
          level: 3
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapContainer.current, options);

        // 마커 위치 설정
        const markerPosition  = new window.kakao.maps.LatLng(response.data.latitude, response.data.longitude);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });

        // 마커를 지도에 표시
        marker.setMap(map);

      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    };

    // 플레이스 메뉴 가져오기
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/place/${id}/menuInfo`);
        setMenuData(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    // 플레이스 리뷰 가져오기
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/place/${id}/review`);
        setReviewData(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    // 이미지 크롤링하여 가져오기
    const fetchImage = async () => {
      if(!placeData.image) {
        try {
          // place 반환
          const response = await axios.get(`http://localhost:8080/place/${id}/image`, {
            params:{
              lat: location.lat,
              lon: location.lon,
            }
          });
          setPlaceData(response.data);
        } catch (error) {
          console.error('Error fetching menu:', error);
        }
      }
    };

    fetchPlaceDetails();
    fetchMenu();
    fetchReviews();
    fetchImage();
  }, [id, location.lat, location.lon]);

  // 별점을 표시하는 함수
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          type={i <= rating ? 'star_full' : 'star_empty'}
          key={i}
        />
      );
    }
    return <div className="place-stars">{stars}</div>;
  };

  return (
    <div>
      {/* 플레이스 페이지 바 */}
      <div className="place-page-bar">
        <div className="place-title">
          <Icon type="Place" />
          플레이스 검색
        </div>
        <div className="spacer"></div>
        <div className="right-icons">
          <Icon type="Location" />
          <div className='location-info'>
           <b><LocationInfo /></b>
          </div>
          <div className="place-search-bar">
            <SearchBar />
          </div>
        </div>
      </div>
    
      {/* 플레이스 정보 섹션 */}
      <div className="place-info">
        <div className="place-name-and-rating">
          <h1>
            {placeData ? placeData.name : '가게 이름'}
          </h1>
          <div className="place-rating">
            {placeData ? renderStars(placeData.rating) : renderStars(0)}
          </div>
          {/* 주소와 거리 표시 */}
          <div className="place-location">
            {placeData ? (
              <p>주소: {placeData.address} ({placeData.distance}m)</p>
            ) : (
              <p>주소 정보 미등록 상태입니다.</p>
            )}
          </div>
        </div>
         <div>
          <div className="place-category">
            {placeData ? `카테고리 > ${placeData.categoryMiddleName}` : '카테고리'}
          </div>
         </div>
      </div>

      {/* 플레이스 상세 정보 및 지도 섹션 */}
      <div className="place-details-and-map">
        {menuData.length > 0 ? (
          <div className="place-details">
            <h2>메뉴</h2>
            <ul>
              {menuData.map((menu, index) => (
                <li key={index}>{menu.name} {menu.price ? `- ${menu.price}원` : ''}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div 
          className={`place-map ${menuData.length === 0 ? 'full-width' : ''}`}
          ref={mapContainer} 
          style={{ width: '100%', height: '400px' }}>
          {/* 지도 컴포넌트 */}
        </div>
      </div>
<p></p>
      {/* 리뷰와 이미지를 담을 컨테이너 */}
      <div className="place-reviews-and-image">
        {/* 리뷰 섹션 */}
        <div className="place-reviews">
          <h2>리뷰</h2>
          {reviewData.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-rating">{renderStars(review.rating)}</div>
              <p className="review-content">{review.content}</p>
              <p className="review-author">{review.nickname}</p>
            </div>
          ))}
          <button onClick={() => navigate(`/place/reviewing/${id}`)}>리뷰 저장</button>
        </div>
        {/* 이미지 처리 */}
        {placeData.image ? (<img src={placeData.image} />) : null}
      </div>
    </div>
  );
}

export default Place_DetailPage;