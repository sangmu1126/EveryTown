package com.inha.everytown.domain.board.dto;

import com.inha.everytown.domain.board.entity.relation.Comment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResDto {

    private Long id;
    private Long memberId;
    private String thumbnail;
    private String nickname;
    private String content;
    private LocalDateTime createdAt;

    @Builder
    public CommentResDto(Long id, Long memberId, String thumbnail, String nickname, String content, LocalDateTime createdAt) {
        this.id = id;
        this.memberId = memberId;
        this.thumbnail = thumbnail;
        this.nickname = nickname;
        this.content = content;
        this.createdAt = createdAt;
    }

    public static CommentResDto EntityToDto(Comment comment) {
        return CommentResDto.builder()
                .id(comment.getId())
                .memberId(comment.getMember().getId())
                .thumbnail(comment.getMember().getThumbnail())
                .nickname(comment.getMember().getNickname())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
