package com.inha.everytown.domain.place.dto;


import com.inha.everytown.domain.place.entity.relation.PlaceReview;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlaceReviewResDto {

    private Long id;
    private Integer rating;
    private String content;
    private Long memberId;
    private String nickname;
    private String thumbnail;
    private List<String> tag;
    private LocalDateTime createdAt;

    @Builder
    public PlaceReviewResDto(Long id, Integer rating, String content, Long memberId, String nickname, String thumbnail, List<String> tag, LocalDateTime createdAt) {
        this.id = id;
        this.rating = rating;
        this.content = content;
        this.memberId = memberId;
        this.nickname = nickname;
        this.thumbnail = thumbnail;
        this.tag = tag;
        this.createdAt = createdAt;
    }

    public void setTag(List<String> tag) {
        this.tag = tag;
    }

    public static PlaceReviewResDto EntityToDto(PlaceReview placeReview) {
        return PlaceReviewResDto.builder()
                .id(placeReview.getId())
                .rating(placeReview.getRating())
                .content(placeReview.getContent())
                .memberId(placeReview.getMember().getId())
                .nickname(placeReview.getNickname())
                .thumbnail(placeReview.getMember().getThumbnail())
                .createdAt(placeReview.getCreatedAt())
                .build();
    }
}
