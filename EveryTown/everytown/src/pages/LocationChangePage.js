// LocationChangePage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from '../components/LocationContext';
import { useNavigate } from 'react-router-dom'; 
import './LocationChangePage.css';

const LocationChangePage = () => {
  const { setLocation } = useLocation();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [localLocation, setLocalLocation] = useState(null); 
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById('map');
        if (!container) return;
        
        const options = {
          center: new window.kakao.maps.LatLng(37.4514023588, 126.6514957083), // 기본 위치 (인하공전 인근)
          level: 3
        };
        const newMap = new window.kakao.maps.Map(container, options);
        setMap(newMap);
      } else {
        // 아직 로드되지 않았다면 100ms 후에 다시 시도
        setTimeout(initMap, 100);
      }
    };

    initMap();
  }, []);

  const handleSearch = () => {
    if (!window.kakao || !window.kakao.maps || !map) {
      alert("지도가 아직 준비되지 않았습니다. 잠시만 기다려 주세요.");
      return;
    }

    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(searchKeyword, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y, x, place_name } = result[0];
        const coords = new window.kakao.maps.LatLng(y, x);
        map.setCenter(coords);
        // 마커 생성 및 지도에 추가
        if (marker) {
          marker.setMap(null); // 기존 마커가 있으면 제거
        }
        const newMarker = new window.kakao.maps.Marker({
          map: map,
          position: coords
        });
        setMarker(newMarker); // 마커 상태 업데이트
        setLocalLocation({ lat: y, lon: x, address: place_name });
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSetLocation = () => {
    if (localLocation) {
      setLocation(localLocation);
      navigate('/');
    }
  };

  return (
    <div className='location-change-page'>
      <p></p>
      <div className='location-search-button'>
        위치 설정: <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
       <button onClick={handleSearch}>검색</button>
      </div>
      <p></p>
      <div id="map" style={{ width: '80%', height: '700px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {(!window.kakao || !window.kakao.maps) && <p>지도를 불러오는 중입니다...</p>}
      </div>
      <p></p>
      <div >
       <button className='location-set-location-button' onClick={handleSetLocation}>위치 저장</button>
      </div>
    </div>
  );
};
export default LocationChangePage;