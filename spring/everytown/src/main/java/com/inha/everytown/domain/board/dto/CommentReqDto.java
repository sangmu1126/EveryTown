package com.inha.everytown.domain.board.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommentReqDto {

    private String content;

    @Builder
    public CommentReqDto(String content) {
        this.content = content;
    }
}
