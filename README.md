# 🏙️ EveryTown

> 1인 가구를 위한 지역 정보 제공 서비스  
> Elasticsearch를 활용한 고성능 검색 시스템 탑재

위치 기반으로 상가, 커뮤니티, 채팅 기능을 제공하는 웹 서비스. MySQL + Elasticsearch로 성능을 극대화한 지역 밀착형 정보 플랫폼입니다.

## 📌 프로젝트 기간
2023.09 ~ 2023.12

## 🧑‍💻 팀 구성 및 역할
- 팀원: 3명 (BackEnd 2, FrontEnd 1)
- 내 역할: **BackEnd 개발 및 팀장**

## 🌟 주요 기능
- 지역 상가 정보 위치 기반 검색
- 커뮤니티 게시판 및 실시간 채팅 기능
- 사용자 위치 기반 정렬
- Docker 기반 ELK 스택 구성

## 🧰 기술 스택
- Frontend: HTML, CSS, JavaScript, React
- Backend: Spring Boot, STOMP
- DB: MySQL, Elasticsearch, Logstash, Kibana
- DevOps: Docker

## 🔧 내가 담당한 부분
- MySQL과 Elasticsearch 동기화
- 한글 검색 최적화를 위한 Nori tokenizer 적용
- 채팅 기능 구현 (STOMP 기반)
- Docker로 ELK 스택 컨테이너화
- 커뮤니티 게시판 + React 연동 UI

## 🔄 트러블슈팅
- 대용량 상가 정보 검색 속도 문제 발생 (2s → 200ms, 캐시 시 10ms)
- IO 병목을 방지하기 위한 DB 구조 개선
- 검색 정확도를 위해 형태소 분석 기반 검색엔진 구성

## 📎 관련 자료
- 📄 [보고서](https://docs.google.com/document/d/1Zllg3lDuv-dEGombYiowHgKHdV3grfAq/edit)
- 📽️ [소개 영상](https://youtu.be/j1DEnthmLNE)
- 🧾 [EndPoint 문서](https://drive.google.com/file/d/117iecHhuIsq1HFK2e6KtDn9TexVh5G_f/view)
- 🖼️ [전시 패널](https://docs.google.com/presentation/d/1ZTzCi61T8RARKUR96Yrp9BYDdZXibNvj/edit)
