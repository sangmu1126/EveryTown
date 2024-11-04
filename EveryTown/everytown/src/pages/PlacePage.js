//PlacePage.js
import React, { useState, useEffect, useContext } from 'react';
import './PlacePage.css';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import LocationInfo from '../components/LocationInfo';
import axios from 'axios';
import { useLocation } from '../components/LocationContext';
import { SearchContext } from '../components/SearchContext';


function PlacePage() {
  const navigate = useNavigate();
  const { location } = useLocation(); // 전역 위치 상태 사용
  const [place, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortMethod, setSortMethod] = useState('rating');
  const [category, setCategory] = useState();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchData();
    }
  }, [location, currentPage, category, tags, sortMethod]); 

  const fetchRecommendations = async () => {
    try {
      const categoryCode = category || 'I212'; // Default to 'I212' if no category is selected
      const response = await axios.get('http://localhost:8080/place/recommend', {
        params: {
          lat: location.lat,
          lon: location.lon,
          cate: categoryCode
        }
      });
      navigate('/place/recommending', { state: { place: response.data } });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };
  
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/place', {
        params: {
          lat: location.lat,
          lon: location.lon,
          cate: category,
          tag: tags.join(" "),
          page: currentPage,
          criteria: sortMethod
        }
      });
      setRestaurants(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const categoryMapping = {
    '카페': 'I212',
    '숙박': 'I101',
    '스포츠': 'R103',
    '병원': 'Q101 Q102 Q104 M111',
    '약국': 'G215',
    '문화시설': 'R104',
    '주점': 'I211'
  };



  const goToPlace_RestaurantDetails = (id) => {
    navigate(`/place/${id}`);
  };

  // 별점을 렌더링하는 함수
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

     // 페이지 번호를 변경하는 함수
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 0; i < totalPages; i++) {
      // 최초, 현재, 최종 페이지만 표시하고, 나머지는 점으로 표시
      if (i === 0 || i === totalPages - 1 || i === currentPage - 1 || i === currentPage || i === currentPage + 1) {
        pages.push(
          <button key={i} onClick={() => handlePageChange(i)} className={currentPage === i ? "active" : ""}>
            {i + 1}
          </button>
        );
      } else if (i === 1 && currentPage > 2) {
        // 현재 페이지가 처음 페이지보다 멀리 떨어져 있을 때 시작 부분에 점을 추가
        pages.push(<span key="start-ellipsis">...</span>);
      } else if (i === totalPages - 2 && currentPage < totalPages - 3) {
        // 현재 페이지가 마지막 페이지보다 멀리 떨어져 있을 때 끝 부분에 점을 추가
        pages.push(<span key="end-ellipsis">...</span>);
      }
    }
    return <div className="pagination">{pages}</div>;
  };

  const handleSortChange = (e) => {
    setSortMethod(e.target.value); // 사용자가 선택한 정렬 방식으로 상태 업데이트
    setCurrentPage(0)
  };

  const changeCategory = (cate) => {
    const categoryDB = categoryMapping[cate];
    if (category === categoryDB) {
      setCategory(null); // 이미 선택된 카테고리를 다시 누르면 해제
    } else {
      setCategory(categoryDB); // 새 카테고리 선택
    }
    setCurrentPage(0);
  };
  

  const changeTag = (selectedTag) => {
    if (tags.includes(selectedTag)) {
      setTags(tags.filter(t => t !== selectedTag)); 
    } else {
      setTags([...tags, selectedTag]);
    }
    setCurrentPage(0);
  };
  
  

  const { searchResults } = useContext(SearchContext);

  useEffect(() => {
    // 검색 결과가 있는 경우에만 해당 결과를 화면에 표시합니다.
    if (searchResults && searchResults.length > 0) {
      setRestaurants(searchResults);
      setCurrentPage(0);
      setTotalPages(1);
    } else {
      fetchData(); // 검색 결과가 없는 경우 기본 데이터 로딩
    }
  }, [searchResults, location, currentPage, category, tags, sortMethod]);


  return (
    <div>
      {/* 플레이스 페이지 바 */}
      <div className="place-page-bar">
          <div className="place-title">
              <Icon type="Place" />
              플레이스 검색
          </div>
          <div className="spacer"></div>
          <div className="place-right-icons">
              <div>
                <Icon type="Location" />
              </div>
              <div className='location-info'>
              <b><LocationInfo /></b>
              </div>
              <div className="place-search-bar">
                <SearchBar />
              </div>
          </div>
      </div>

      <div className="place-category-bar">
          <div className='categories-with-tags-section'>
            <div className="place-categories">
              플레이스:&nbsp;
              <button onClick={() => changeCategory('카페')}  className={category === 'I212' ? 'selected' : ''}>#카페</button>
              <button onClick={() => changeCategory('숙박')}  className={category === 'I101' ? 'selected' : ''}>#숙박</button>
              <button onClick={() => changeCategory('스포츠')}  className={category === 'R103' ? 'selected' : ''}>#스포츠</button>
              <button onClick={() => changeCategory('병원')}  className={category ===  'Q101 Q102 Q104 M111' ? 'selected' : ''}>#병원</button>
              <button onClick={() => changeCategory('약국')}  className={category === 'G215' ? 'selected' : ''}>#약국</button>
              <button onClick={() => changeCategory('문화시설')}  className={category === 'R104' ? 'selected' : ''}>#문화시설</button>
              <button onClick={() => changeCategory('주점')}  className={category === 'I211' ? 'selected' : ''}>#주점</button>
            </div>
            <p></p>
            <div className="place-tags">
              태그:&nbsp;
              <button onClick={() => changeTag('혼술')} className={tags.includes('혼술') ? 'selected' : ''}>#혼술</button>
              <button onClick={() => changeTag('가성비')} className={tags.includes('가성비') ? 'selected' : ''}>#가성비</button>
            </div>
          </div>
          
          <div className="recommend-button">
            <button className="special-recommend-button" onClick={fetchRecommendations}>추천받기</button>
          </div>
      </div>
      <p></p>
      {/* 정렬 선택 바 */}
      <div className="sort-select-container">
        <label htmlFor="sort-select">정렬:</label>
        <select id="sort-select" onChange={handleSortChange}>
          <option value="rating">평점순</option>
          <option value="dist">거리순</option>
        </select>
      </div>


      {/* 플레이스점 리스트 */}
      <div className="place-list">
        {place.map((place, index) => (
          <div key={index} className="place-item" onClick={() => goToPlace_RestaurantDetails(place.id)}>
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
      {renderPageNumbers()}
    </div>
  );
}

export default PlacePage;