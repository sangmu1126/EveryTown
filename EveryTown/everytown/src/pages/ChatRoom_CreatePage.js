// ChatRoom_CreatePage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar'; 
import LocationInfo from '../components/LocationInfo';
import axios from 'axios';
import { useLocation } from '../components/LocationContext';
// import './ChatRoom_CreatePage.css';

function ChatRoom_CreatePage() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [tag, setTag] = useState('');
  const { location } = useLocation(); // 전역 위치 상태 사용

  const handleCreateRoom = async () => {
    try {
      // 태그를 문자열로 받아서 배열로 변환
      let tags = tag.replace(/#/g,'').replace(/,/g,'').split(' ');
      
      // 채팅방 생성
      const response = await axios.post(`http://localhost:8080/chat/room`, {
        name: roomName,
        tag: tags,
        address: location.address
      },
      { params: {
        lat: location.lat,
        lon: location.lon,
      }
      });
      localStorage.setItem("roomName", response.data.name);
      goToChatRoom(response.data.id)
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  // 채팅방 이동
  const goToChatRoom = async (roomId) => {
    // 참가 인원수 늘리기
    axios.get(`http://localhost:8080/chat/room/${roomId}/enter`)
    navigate(`/chat/room/${roomId}`);
  };

  return (
    <div>
      {/* 음식 페이지 바 */}
      <div className="Chat-page-bar">
        <div className="Chat-title">
          <Icon type="Chat" />
          채팅
        </div>
        <div className="spacer"></div>
        <div className="right-icons">
          <Icon type="Location" />
          <div className='location-info'>
           <b><LocationInfo /></b>
          </div>
          <div className="Chat-search-bar">
            <SearchBar />
          </div>
        </div>
      </div>

       {/* Textarea */}
       <textarea 
        value={roomName} 
        onChange={(e) => setRoomName(e.target.value)}
        style={{ 
          width: '100%', 
          height: '10em' 
        }}
      />
      <p></p>

      {/* 태그 입력 -> '#한식 #무한리필' 처럼 공백을 기준으로 #붙여서 작성하면 배열로 변환해서 서버에 보냄*/}
      <textarea 
        value={tag} 
        onChange={(e) => setTag(e.target.value)}
      />
      <button onClick={handleCreateRoom}>채팅방 만들기</button>
    </div>
  );
}

export default ChatRoom_CreatePage;