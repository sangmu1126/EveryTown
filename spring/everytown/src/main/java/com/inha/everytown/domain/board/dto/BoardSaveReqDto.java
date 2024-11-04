package com.inha.everytown.domain.board.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class BoardSaveReqDto {

    private Long boardCategory;
    private String title;
    private String content;
    private String address;

    @Builder
    public BoardSaveReqDto(Long boardCategory, String title, String content, String address) {
        this.boardCategory = boardCategory;
        this.title = title;
        this.content = content;
        this.address = address;
    }
}
