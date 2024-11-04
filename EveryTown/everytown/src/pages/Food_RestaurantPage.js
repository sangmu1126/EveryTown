// Food_RestaurantPage.js
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar'; 
import './Food_RestaurantPage.css';
import LocationInfo from '../components/LocationInfo';
import axios from 'axios';
import { LocationContext } from '../components/LocationContext';


function Food_RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { location } = useContext(LocationContext);
  const [restaurantData, setRestaurantData] = useState({
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
    // 서버로부터 음식점 상세 정보를 가져옵니다.
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/restaurants/${id}/basicInfo`, {
         
        params: {
            lat: location.lat,
            lon: location.lon,
          }
        });
        setRestaurantData(response.data);
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
        console.error('Error fetching restaurant details:', error);
      }
    };

    // 음식점 메뉴 가져오기
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/restaurants/${id}/menuInfo`);
        setMenuData(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    // 음식점 리뷰 가져오기
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/restaurants/${id}/review`);
        setReviewData(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    // 이미지 크롤링하여 가져오기
    const fetchImage = async () => {
      if(!restaurantData.image) {
        try {
          // restaurant 반환
          const response = await axios.get(`http://localhost:8080/restaurants/${id}/image`, {
            params:{
              lat: location.lat,
              lon: location.lon,
            }
          });
          setRestaurantData(response.data);
        } catch (error) {
          console.error('Error fetching menu:', error);
        }
      }
    };

    fetchRestaurantDetails();
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
    return <div className="restaurant-stars">{stars}</div>;
  };

  return (
    <div>
      {/* 음식 페이지 바 */}
      <div className="food-page-bar">
        <div className="food-title">
          <Icon type="Food" />
          식당 검색
        </div>
        <div className="spacer"></div>
        <div className="right-icons">
          <Icon type="Location" />
          <div className='location-info'>
           <b><LocationInfo /></b>
          </div>
          <div className="food-search-bar">
            <SearchBar />
          </div>
        </div>
      </div>
    
      {/* 음식점 정보 섹션 */}
      <div className="restaurant-info">
        <div className="restaurant-name-and-rating">
          <h1>
            {restaurantData ? restaurantData.name : '가게 이름'}
          </h1>
          <div className="restaurant-rating">
            {restaurantData ? renderStars(restaurantData.rating) : renderStars(0)}
          </div>
          {/* 주소와 거리 표시 */}
          <div className="restaurant-location">
            {restaurantData ? (
              <p>주소: {restaurantData.address} ({restaurantData.distance}m)</p>
            ) : (
              <p>주소 정보 미등록 상태입니다.</p>
            )}
          </div>
        </div>
         <div>
          <div className="restaurant-category">
            {restaurantData ? `카테고리 > ${restaurantData.categoryMiddleName}` : '카테고리'}
          </div>
         </div>
      </div>

      {/* 음식점 상세 정보 및 지도 섹션 */}
      <div className="restaurant-details-and-map">
        {menuData.length > 0 ? (
          <div className="restaurant-details">
            <h2>메뉴</h2>
            <ul>
              {menuData.map((menu, index) => (
                <li key={index}>{menu.name} {menu.price ? `- ${menu.price}원` : ''}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div 
          className={`restaurant-map ${menuData.length === 0 ? 'full-width' : ''}`}
          ref={mapContainer} 
          style={{ width: '100%', height: '400px' }}>
          {/* 지도 컴포넌트 */}
        </div>
      </div>
<p></p>
      {/* 리뷰와 이미지를 담을 컨테이너 */}
      <div className="restaurant-reviews-and-image">
        {/* 리뷰 섹션 */}
        <div className="restaurant-reviews">
          <h2>리뷰</h2>
          {reviewData.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-rating">{renderStars(review.rating)}</div>
              <p className="review-content">{review.content}</p>
              <p className="review-author">{review.nickname}</p>
            </div>
          ))}
          <button onClick={() => navigate(`/food/reviewing/${id}`)}>리뷰 저장</button>
        </div>
        {/* 이미지 처리 */}
        {restaurantData.image ? (<img src={restaurantData.image} />) : null}
      </div>
    </div>
  );
}

export default Food_RestaurantPage;