package com.inha.everytown.domain.board.repository.relation;

import com.inha.everytown.domain.board.entity.relation.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByBoard_Id(Long boardId, Pageable pageable);

    void deleteByBoard_Id(Long id);
}
