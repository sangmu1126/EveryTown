package com.inha.everytown.domain.board.entity.relation;

import com.inha.everytown.domain.board.dto.CommentReqDto;
import com.inha.everytown.domain.member.entity.Member;
import com.inha.everytown.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "comment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseTimeEntity {

    @Id
    @Column(name = "id", nullable = false, columnDefinition = "bigint")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(name = "content", nullable = false)
    private String content;

    @Builder
    public Comment(Long id, Member member, Board board, String content) {
        this.id = id;
        this.member = member;
        this.board = board;
        this.content = content;
    }

    public void update(CommentReqDto dto) {
        this.content = dto.getContent();
    }
}
