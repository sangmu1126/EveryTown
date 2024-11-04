package com.inha.everytown.domain.board.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class BoardUpdateReqDto {

    private String title;
    private String content;

    @Builder
    public BoardUpdateReqDto(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
