package com.inha.everytown.domain.board.entity.relation;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "board_category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BoardCategory {

    @Id
    @Column(name = "id", nullable = false, columnDefinition = "bigint")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Builder
    public BoardCategory(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
