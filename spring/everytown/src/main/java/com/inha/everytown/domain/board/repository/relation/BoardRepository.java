package com.inha.everytown.domain.board.repository.relation;

import com.inha.everytown.domain.board.entity.relation.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("SELECT b FROM Board b WHERE ST_Distance_Sphere(POINT(:lon, :lat), POINT(b.longitude, b.latitude)) <= 1000 AND b.boardCategory.id = :categoryId")
    Page<Board> findNearBoardWithCategory(Long categoryId, double lat, double lon, Pageable pageable);

    @Query("SELECT b FROM Board b WHERE ST_Distance_Sphere(POINT(:lon, :lat), POINT(b.longitude, b.latitude)) <= 1000")
    Page<Board> findNearBoard(double lat, double lon, Pageable pageable);
}