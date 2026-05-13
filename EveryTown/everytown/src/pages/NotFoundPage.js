import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>죄송합니다. 요청하신 페이지가 존재하지 않거나 삭제되었습니다.</p>
      <button 
        onClick={() => navigate('/')}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default NotFoundPage;
