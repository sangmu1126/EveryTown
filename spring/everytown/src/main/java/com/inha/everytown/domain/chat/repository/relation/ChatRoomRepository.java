package com.inha.everytown.domain.chat.repository.relation;

import com.inha.everytown.domain.chat.entity.relation.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT c FROM ChatRoom c WHERE ST_Distance_Sphere(POINT(:lon, :lat), POINT(c.longitude, c.latitude)) <= 1000")
    Page<ChatRoom> findNearBy(double lat, double lon, Pageable pageable);
}
