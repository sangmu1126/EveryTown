// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LocationProvider } from './components/LocationContext';
import NavigationBar from './components/NavigationBar';
import MainPage from './pages/MainPage';
import LocationChangePage from './pages/LocationChangePage';
import LoginPage from './pages/LoginPage';
import LoginRedirectPage from './pages/LoginRedirectedPage';
import FoodPage from './pages/FoodPage';
import FoodRestaurantPage from './pages/Food_RestaurantPage';
import FoodReviewingPage from './pages/Food_ReviewingPage';
import FoodRecommendingPage from './pages/Food_RecommendingPage';
import PlacePage from './pages/PlacePage';
import PlaceDetailPage from './pages/Place_DetailPage';
import PlaceReviewingPage from './pages/Place_ReviewingPage';
import PlaceRecommendingPage from './pages/Place_RecommendingPage';
import ChatPage from './pages/ChatPage';
import ChatRoom from './pages/ChatRoom';
import ChatRoomCreatePage from './pages/ChatRoom_CreatePage';
import CommunityPage from './pages/CommunityPage';
import CommunityDetailPage from './pages/Community_DetailPage';
import CommunityCreatePage from './pages/Community_CreatePage';
import CommunityModifyPage from './pages/Community_ModifyPage';
import NotFoundPage from './pages/NotFoundPage';
import { SearchProvider } from './components/SearchContext';
import SearchPage from './pages/SearchPage.js';
import FoodSearchPage from'./pages/Food_SearchPage.js';
import PlaceSearchPage from'./pages/Place_SearchPage.js';
import ChatSearchPage from'./pages/Chat_SearchPage.js';
import CommunitySearchPage from'./pages/Community_SearchPage.js';



function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState(localStorage.getItem('accessTokenExpiresAt'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));

// 로그아웃 처리 함수
const handleLogout = async () => {
  try {
    await axios.post('http://localhost:8080/auth/logout', {
      refreshToken: localStorage.getItem('refreshToken')
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpiresAt');
    // 사용자 데이터 삭제
    localStorage.removeItem('id');
    localStorage.removeItem('nickname');
    localStorage.removeItem('thumbnail');
    setIsLoggedIn(false); // 로그아웃 상태로 변경
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  // 토큰 만료 시 재발급 함수
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/reissue', {
        refreshToken: localStorage.getItem('refreshToken')
      });
      setAccessToken(response.data.accessToken);
      setAccessTokenExpiresAt(response.data.accessTokenExpiresAt);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken); // Fixed
      localStorage.setItem('accessTokenExpiresAt', response.data.accessTokenExpiresAt);
    } catch (error) {
      console.error('Token refresh error:', error);
      handleLogout();
    }
  };
  

  // 액세스 토큰 만료 검사 및 재발급 로직
  useEffect(() => {
    const checkTokenValidity = () => {
      const now = Math.floor(Date.now() / 1000); // Current time in Unix format
      if (accessTokenExpiresAt && now >= parseInt(accessTokenExpiresAt)) {
        refreshAccessToken();
      }
    };
  
    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 60000); // Every 1 minute
    return () => clearInterval(interval);
  }, [accessTokenExpiresAt, refreshAccessToken]);
  



  // Axios 인터셉터 설정
  useEffect(() => {
    const axiosInterceptor = axios.interceptors.request.use(
      async config => {
        if (accessToken && accessTokenExpiresAt) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );
  
    return () => {
      axios.interceptors.request.eject(axiosInterceptor);
    };
  }, [accessToken, accessTokenExpiresAt]);
  

  return (
    <SearchProvider>
      <Router>
        <LocationProvider>
          <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/locationchange" element={<LocationChangePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/redirected/:platform" element={<LoginRedirectPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/food/:id" element={<FoodRestaurantPage />} />
            <Route path="/food/reviewing/:id" element={<FoodReviewingPage />} /> 
            <Route path="/food/recommending" element={<FoodRecommendingPage />} /> 
            <Route path="/place" element={<PlacePage />} />
            <Route path="/place/:id" element={<PlaceDetailPage />} />
            <Route path="/place/reviewing/:id" element={<PlaceReviewingPage />} />
            <Route path="/place/recommending" element={<PlaceRecommendingPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/room/:id" element={<ChatRoom />} />
            <Route path="/chat/room/create" element={<ChatRoomCreatePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:id" element={<CommunityDetailPage/>}/>
            <Route path="/community/create" element={<CommunityCreatePage />} />
            <Route path="/community/modify/:id" element={<CommunityModifyPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/food_search" element={<FoodSearchPage />} />
            <Route path="/place_search" element={<PlaceSearchPage />} />
            <Route path="/chat_search" element={<ChatSearchPage />} />
            <Route path="/community_search" element={<CommunitySearchPage />} />
          </Routes>
        </LocationProvider>
      </Router>
    </SearchProvider>
  );
}

export default App;