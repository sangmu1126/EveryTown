//Community_DetailPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 추가
import './Community_DetailPage.css';
import Icon from '../components/Icon';

const CommunityDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, title, content, thumbnail, viewCnt, commentCnt, likeCnt, nickname, address, createdAt } = location.state;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // 시간 포맷팅 함수
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  const handleSubmitComment = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/boards/${id}/comment`, {
        content: comment
      });
  
      const newCommentData = response.data;
      setComments((prevComments) => [...prevComments, newCommentData]);
  
      setComment('');
      
      // navigate 함수에서 location.state의 값을 그대로 사용
      navigate(`/community/${id}`, {
        state: {
          id,
          title,
          content,
          nickname,
          address,
          createdAt
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  

  // 댓글 수정
  const handleDeleteComment = async (commentId) => {
    try {
      // 서버에 댓글 삭제 요청
      const response = await axios.delete(
        `http://localhost:8080/boards/${id}/comment/${commentId}?page=${currentPage}`
      );

      // 삭제된 댓글을 댓글 목록에서 제외
      const deletedCommentData = response.data;
      setComments(deletedCommentData.content);
    } catch (error) {
      console.error(error);
    }
  };

  // 댓글 수정
  const handleEditComment = async (commentId, editedContent) => {
    try {
      // 서버에 댓글 수정 요청
      const response = await axios.post(
        `http://localhost:8080/boards/${id}/comment/${commentId}?page=${currentPage}`,
        {
          content: editedContent,
        }
      );

      // 수정된 댓글을 댓글 목록에 반영
      const updatedCommentData = response.data;
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? updatedCommentData.content : comment
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // 페이지 로딩 시 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentResponse = await axios.get(
          `http://localhost:8080/boards/${id}/comment?page=${currentPage}`
        );
        const commentData = commentResponse.data;
        setComments(commentData.content);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, [id, currentPage]);

  return (
    <div className='community-detailpage'>
      <div className='community-user-info-bar'>
        <div className='community-user'>
          작성자: {nickname}&nbsp;
          <p></p>
          위치:{address}&nbsp;
          <p></p>
          시간:{formatTime(createdAt)}
        </div>
      </div>
         제목: {title}
      <p>내용: {content}</p>
      <div className="content-spacing"></div>
      <div className="comment-container">

        <textarea 
          className="response-textfield" 
          placeholder="댓글을 입력하세요"
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button className="submit-comment-button" onClick={handleSubmitComment}>
          댓글 입력
        </button>
      </div>

      {/* 댓글 목록 표시 */}
      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <img src={comment.thumbnail} alt={comment.nickname} />
            <p>{comment.nickname}</p>
            <p>{comment.content}</p>
            <p>{comment.createdAt}</p>
            {/* 수정 버튼과 삭제 버튼 추가 */}
            <button onClick={() => handleEditComment(comment.id, "수정된 댓글 내용")}>
              댓글 수정
            </button>
            <button onClick={() => handleDeleteComment(comment.id)}>
              댓글 삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDetailPage;