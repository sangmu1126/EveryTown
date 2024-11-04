package com.inha.everytown.domain.board.dto;

import com.inha.everytown.domain.board.entity.document.BoardDoc;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BoardSearchResDto {

    private Long id;
    private Long memberId;
    private String category;
    private String nickname;
    private String title;
    private String content;
    private String address;
    private Long viewCnt;
    private Long commentCnt;
    private Long likeCnt;
    private LocalDateTime createdAt;

    @Builder
    public BoardSearchResDto(Long id, Long memberId, String category, String nickname, String title, String content, String address, Long viewCnt, Long commentCnt, Long likeCnt, LocalDateTime createdAt) {
        this.id = id;
        this.memberId = memberId;
        this.category = category;
        this.nickname = nickname;
        this.title = title;
        this.content = content;
        this.address = address;
        this.viewCnt = viewCnt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;
        this.createdAt = createdAt;
    }

    public static BoardSearchResDto DocToDto(BoardDoc boardDoc) {
        return BoardSearchResDto.builder()
                .id(boardDoc.getId())
                .memberId(boardDoc.getMember_id())
                .category(boardDoc.getCategory())
                .nickname(boardDoc.getNickname())
                .title(boardDoc.getTitle())
                .content(boardDoc.getContent())
                .address(boardDoc.getAddress())
                .viewCnt(boardDoc.getViewCnt())
                .commentCnt(boardDoc.getCommentCnt())
                .likeCnt(boardDoc.getLikeCnt())
                .createdAt(boardDoc.getCreated_at())
                .build();
    }
}
