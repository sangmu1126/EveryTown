package com.inha.everytown.domain.board.dto;

import com.inha.everytown.domain.board.entity.relation.Board;
import com.inha.everytown.domain.board.entity.relation.BoardCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BoardResDto {

    private Long id;
    private Long memberId;
    private String thumbnail;
    private String nickname;
    private String title;
    private String content;
    private String address;
    private Long viewCnt;
    private Long commentCnt;
    private Long likeCnt;
    private LocalDateTime createdAt;

    @Builder
    public BoardResDto(Long id, Long memberId, String thumbnail, String nickname, String title, String content, String address, Long viewCnt, Long commentCnt, Long likeCnt, LocalDateTime createdAt) {
        this.id = id;
        this.memberId = memberId;
        this.thumbnail = thumbnail;
        this.nickname = nickname;
        this.title = title;
        this.content = content;
        this.address = address;
        this.viewCnt = viewCnt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;
        this.createdAt = createdAt;
    }

    public static BoardResDto EntityToDto(Board board) {
        return BoardResDto.builder()
                .id(board.getId())
                .memberId(board.getMember().getId())
                .thumbnail(board.getMember().getThumbnail())
                .nickname(board.getMember().getNickname())
                .title(board.getTitle())
                .content(board.getContent())
                .address(board.getAddress())
                .viewCnt(board.getViewCnt())
                .commentCnt(board.getCommentCnt())
                .likeCnt(board.getLikeCnt())
                .createdAt(board.getCreatedAt())
                .build();
    }
}
