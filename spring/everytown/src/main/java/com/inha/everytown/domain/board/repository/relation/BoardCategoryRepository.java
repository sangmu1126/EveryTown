package com.inha.everytown.domain.board.repository.relation;

import com.inha.everytown.domain.board.entity.relation.BoardCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardCategoryRepository extends JpaRepository<BoardCategory, Long> {


}
