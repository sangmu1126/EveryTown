package com.inha.everytown.domain.board.repository.relation;

import com.inha.everytown.domain.board.entity.relation.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRepository extends JpaRepository<Like, Long> {

    void deleteByBoard_Id(Long boardId);

    List<Like> findByMember_IdAndBoard_Id(Long memberId, Long boardId);
}
