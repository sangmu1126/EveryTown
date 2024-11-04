//CommunityPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './CommunityPage.css';
import SearchBar from '../components/SearchBar';
import Icon from '../components/Icon';
import LocationInfo from '../components/LocationInfo';
import { useLocation } from '../components/LocationContext';

const CommunityItem = ({ id, title, thumbnail, viewCnt, commentCnt, likeCnt, content, nickname, address, createdAt, setCommunitys, onDelete }) => {
  const navigate = useNavigate();
  // 게시글 삭제
  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:8080/boards/${id}`);
      // 삭제 후, 부모 컴포넌트에서 해당 게시글을 제외한 목록으로 업데이트
      onDelete(id);
      navigate('/community');
    } catch (error) {
      console.error(error);
    }
  };

  

  // 게시글을 불러오고 조회수를 증가시키는 함수
  const fetchPostAndIncrementViewCount = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/boards/${id}`);
      const postData = response.data;
      setCommunitys((prevCommunitys) =>
        prevCommunitys.map((community) =>
          community.id === id ? postData : community
        )
      );

      navigate(`/community/${id}`, {
        state: { id, title, thumbnail, viewCnt, commentCnt, likeCnt, content, nickname, address, createdAt },
      });
    } catch (error) {
      console.error(error);
    }
  };



  function formatTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 게시글 수정 버튼 - Community_ModifyPage로 이동
  const navigateToModifyPage = (event) => {
    event.stopPropagation(); // 이벤트 전파 중단
    navigate(`/community/modify/${id}`);
  };


  return (
    <div className="community-item" onClick={fetchPostAndIncrementViewCount}>
      <div className="community-info comp1">
        <h3>{title}</h3>
        <p>{content}</p>
        <p>조회수: {viewCnt}</p>
      </div>
      <div className="community-tags comp2">
        <img src={thumbnail} className="round_image"/>
        <p>{nickname}</p>
      </div>
      <div className="community-people comp3">
        <p>{address}</p>
      </div>
      <div className="community-viewCnt comp4">
        <p>조회수 : {viewCnt}</p>
      </div>
      <div className="community-time comp5">
        <p>{formatTime(createdAt)}</p>
      </div>
      {/* 수정/삭제 버튼 */}
      <button onClick={(event) => navigateToModifyPage(event)}>수정</button>
      <button onClick={deletePost}>삭제</button>
    </div>
  );
};

function CommunityPage() {
  const [Communitys, setCommunitys] = useState([]);
  const navigate = useNavigate();
  const { location } = useLocation();
  const [searchCategory, setSearchCategory] = useState('1');

  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
    fetchDataFromServer(e.target.value);
  };

  const fetchDataFromServer = async (selectedCategory = '') => {
    try {
      const response = await axios.get('http://localhost:8080/boards', {
        params: {
          page: 0,
          category: selectedCategory,
          lat: location.lat,
          lon: location.lon,
        },
      });
      setCommunitys(response.data.content); // 여기서 상태 업데이트
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataFromServer(searchCategory); // 자유게시판 카테고리로 초기 데이터 요청
  }, [searchCategory]);
  

  const navigateToDetailPage = (postId) => {
    // 클릭한 글의 아이디를 이용해 디테일 페이지로 이동
    navigate(`/community/${postId}`);
  };

     // 게시글 작성 페이지로 이동하는 함수
  const navigateToCreatePage = () => {
    navigate('/community/create');
  };

  return (
    <div className="Community-page">
      <div className="community-page-bar">
        <div className="community-title">
          <Icon type="Community" />
          커뮤니티
        </div>
        <div className="spacer"></div>
        <div className="right-icons">
          <div>
            <Icon type="Location" />
          </div>
          <div>
            <b>
              <LocationInfo />
            </b>
          </div>
          <div className="community-search-bar">
            <SearchBar />
          </div>
          
        </div>
      </div>

      <div className="community-search-bar">
      <p></p>
        <label htmlFor="sort-select">정렬:&nbsp;</label>
        <select value={searchCategory} onChange={handleCategoryChange}>
          <option value="1">자유게시판</option>
          <option value="2">취업게시판</option>
          <option value="3">모집게시판</option>
          <option value="4">홍보게시판</option>
        </select>
        &nbsp;
        <p></p>
      </div>

      <div className="left-section">
        {Communitys.map((Community, index) => (
          <CommunityItem 
            key={index} {...Community} setCommunitys={setCommunitys} onDelete={(id) => setCommunitys((prevCommunitys) => prevCommunitys.filter((community) => community.id !== id))}
            onClick={() => navigateToDetailPage(Community.id)} // 클릭 시 디테일 페이지로 이동
          />
        ))}
      </div>

      {/* 게시글 작성 입력 폼 */}
      <div className="new-post-form">
        <button onClick={navigateToCreatePage}>게시글 작성</button>
      </div>
    </div>
  );
}

export default CommunityPage;