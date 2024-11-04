package com.inha.everytown.domain.board.entity.relation;

import com.inha.everytown.domain.board.dto.BoardUpdateReqDto;
import com.inha.everytown.domain.member.entity.Member;
import com.inha.everytown.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "board")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Board extends BaseTimeEntity {

    @Id
    @Column(name = "id", nullable = false, columnDefinition = "bigint")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_category_id")
    private BoardCategory boardCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "view_cnt", nullable = false, columnDefinition = "bigint default 0")
    private Long viewCnt;

    @Column(name = "comment_cnt", nullable = false, columnDefinition = "bigint default 0")
    private Long commentCnt;

    @Column(name = "like_cnt", nullable = false, columnDefinition = "bigint default 0")
    private Long likeCnt;

    @Column(name = "latitude",nullable = false, columnDefinition = "decimal(18, 10)")
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, columnDefinition = "decimal(18, 10)")
    private BigDecimal longitude;

    @Builder
    public Board(Long id, BoardCategory boardCategory, Member member, String title, String content, String address, Long viewCnt, Long commentCnt, Long likeCnt, BigDecimal latitude, BigDecimal longitude) {
        this.id = id;
        this.boardCategory = boardCategory;
        this.member = member;
        this.title = title;
        this.content = content;
        this.address = address;
        this.viewCnt = viewCnt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public void increaseViewCnt() {
        this.viewCnt++;
    }

    public void increaseCommentCnt() { this.commentCnt++; }

    public void decreaseCommentCnt() { this.commentCnt--; }

    public void increaseLikeCnt() { this.likeCnt++; }

    public void decreaseLikeCnt() { this.likeCnt--; }

    public void update(BoardUpdateReqDto reqDto) {
        this.title = reqDto.getTitle();
        this.content = reqDto.getContent();
    }
}
