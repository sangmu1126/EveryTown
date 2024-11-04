//ChatPage.js
import React, { useState, useEffect } from 'react';
import './ChatPage.css';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import LocationInfo from '../components/LocationInfo';
import axios from 'axios';
import { useLocation } from '../components/LocationContext';


// memberId는 채팅방 만든 사람 Id, myId는 현 사용자 Id
const ChatItem = ({ id, name, memberId, nickname, tag, memberCnt, created_at, address }) => {
  const navigate = useNavigate();
  const myId = localStorage.getItem("id");

  const goToChatRoom = async (roomId) => {
    // 입장 -> 이걸 해줘야 참여 인원 수 올라감
    await axios
      .get(`http://localhost:8080/chat/room/${roomId}/enter`)
      .then(response => {
        localStorage.setItem("roomName", response.data.name);
      });
    navigate(`/chat/room/${roomId}`);
  };

  const deleteChatRoom = async (roomId) => {
    axios.delete(`http://localhost:8080/chat/room/${roomId}`);
    window.location.href = "/chat"
  }

  // 채팅 항목을 렌더링하는 컴포넌트입니다.
  return (
    <div className="chat-item" onClick={() => goToChatRoom(id)}>
        <div className="chat-info com1">
          <h3>{name}</h3>
        </div>
        <div className="chat-tagwhat com2">
          {tag.map((tagName, index) => (
            <span key={index} className="tag">
              #{tagName}&nbsp;
            </span>
          ))}
        </div>
        <div className="chat-delete com3">
          {
            myId == memberId ? (<button onClick={(event) => {event.stopPropagation(); deleteChatRoom(id)}}>삭제</button>) : null
          }
        </div>
        <div className="chat-people com4">
           <Icon type="people_icon" />
           인원:<span>{memberCnt}</span>
        </div>
        <div className="chat-createMember com5">
          <span>작성자 : {nickname}</span>
        </div>
        <div className="chat-address com6">
          <span>{address}</span>
        </div>
        <div className="chat-time com7">
          <span>{formatTime(created_at)}</span>
        </div>
    </div>
  );
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

function ChatPage() {
  const { location } = useLocation(); // 전역 위치 상태 사용
  const [chatrooms, setChatrooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchData(location.lat, location.lon);
    }
  }, [location]);

  const fetchData = async (lat, lon) => {
    try {
      const response = await axios.get('http://localhost:8080/chat/rooms', {
        params: {
          lat: lat,
          lon: lon,
          page: 0
        }
      });
      setChatrooms(response.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="chat-page">


      <div className="chat-left-section">
        {/* 여기에 각 채팅방을 렌더링합니다. */}
        {chatrooms.map((chatroom, index) => (
          <ChatItem key={index} {...chatroom} />
        ))}
        <p></p>
        <div className='create-button'>
         <button onClick={() => navigate("/chat/room/create")}>채팅방 생성</button>
        </div>
      </div>


      <div className="chat-right-section">
        <div className='chat'>
          <Icon type="Chat" />채팅
        </div>
        <div className='chat-search-and-category-bar'>
          <SearchBar />
        </div>
        <div className='chat-location-and-info'>
          <div className='location'>
            <Icon type="Location" />
          </div>
          <div className='location-info'>
            <b><LocationInfo /></b>
          </div>
          <p></p>
        </div>
        <div className='chat-tags'>
          <div><b>카테고리</b></div>
          <div className='chat-food-tags'>
            <Icon type='Food' /> 
            <div className="chat-food-categories">
              <p></p>
              <button>#혼밥</button><p></p>
              <button>#혼술</button><p></p>
              <button>#한식</button><p></p>
              <button>#일식</button><p></p>
              <button>#중식</button><p></p>
              <button>#양식</button><p></p>
            </div>
          </div>
          <p></p>
          <div className='chat-place-tags'>
            <Icon type='Place' />
            <div className="chat-place-categories">
              <p></p>
              <button>#카페</button><p></p>
              <button>#숙박</button><p></p>
              <button>#헬스장</button><p></p>
              <button>#병원</button><p></p>
              <button>#약국</button><p></p>
              <button>#문화시설</button><p></p>
              <button>#관광명소</button><p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
