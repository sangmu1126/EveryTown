# EveryTown

> **Local Information Service for Single-Person Households**

**EveryTown** is a location-based web service designed to assist single-person households by providing information on nearby shops, community boards, and real-time chat features based on the user's current location.

## 📅 Project Details
* **Period**: 2023.09 - 2023.12
* **Team Size**: 3 members (2 Backend, 1 Frontend)
* **My Role**: Backend (Team Leader)
    * Implemented search functionality (Elasticsearch integration & optimization)
    * Developed Chat and Community servers
    * Infrastructure setup using Docker

## 🔗 Links
* **GitHub**: [https://github.com/sangmu1126/EveryTown](https://github.com/sangmu1126/EveryTown)
* **Demo Video**: [YouTube Link](https://youtu.be/j1DEnthmLNE)

---

## 🛠️ Tech Stack

### Backend
* **Language & Framework**: Java, Spring Boot
* **Database**: MySQL
* **Search Engine**: Elasticsearch, Logstash, Kibana (ELK Stack)

### Frontend
* **Language & Library**: JavaScript, React
* **MarkUp**: HTML, CSS

### DevOps & Tools
* **Infra**: Docker
* **Collaboration**: Git, GitHub

---

## 💡 Key Features

### 1. Location-Based Shop Search
* Searches for commercial districts within a **2km radius** based on the user's location.
* Utilizes **Nori Tokenizer** to analyze Korean morphemes, allowing for accurate search results even with typos or synonyms.

### 2. Real-Time Chat
* Implemented user-to-user chat using Spring Boot's **STOMP Protocol**.
* Chat history is logged and retrievable.

### 3. Community Board
* Posts from users physically closer to the viewer are sorted with higher priority.
* Supports standard CRUD operations (Create, Read, Update, Delete) and comments.

---

## 🚀 Troubleshooting & Performance Optimization

### ⚡ 10x Search Performance Improvement with Elasticsearch

#### 1. Problem Context
Searching through massive public data for nationwide shops using MySQL resulted in significant latency.
* **Issue**: Using `LIKE` queries combined with `ST_DISTANCE_SPHERE` for location calculation took an average of **2 seconds**.
* **Bottleneck**: The server performance was bound by Disk I/O.

#### 2. Solution
Adopted **Elasticsearch** to minimize database I/O and separate Read/Write responsibilities.

* **Read/Write Separation**: Write operations are handled by MySQL, while Read (Search) operations are offloaded to Elasticsearch.
* **Data Synchronization**: Configured **Logstash** to periodically detect changes in MySQL and synchronize them with Elasticsearch.
* **Optimization**: Replaced the standard tokenizer with **Nori Tokenizer** (specialized for Korean) to improve search accuracy.

#### 3. Results
Query processing speed improved drastically.

* **Latency**: Reduced from **2s** to **200ms** (down to **10ms** when cached).
* **Efficiency**: Optimized server resource usage by containerizing the ELK stack with Docker.

---

## 🏛️ System Architecture

* **Client**: React handles the UI and communicates with the backend.
* **Server**: Spring Boot processes requests and manages business logic.
* **Data Flow**:
    * **MySQL**: Stores persistent data.
    * **Logstash**: Synchronizes data between MySQL and Elasticsearch.
    * **Elasticsearch**: Handles high-speed search queries.
