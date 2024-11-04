package com.inha.everytown.domain.restaurant.dto;

import com.inha.everytown.domain.restaurant.entity.relation.RestaurantReview;
import com.inha.everytown.domain.restaurant.entity.relation.RestaurantTagEnum;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RestaurantReviewResDto {

    private Long id;
    private Integer rating;
    private String content;
    private Long memberId;
    private String nickname;
    private String thumbnail;
    private List<String> tag;
    private LocalDateTime createdAt;

    @Builder
    public RestaurantReviewResDto(Long id, Integer rating, String content, Long memberId, String nickname, String thumbnail, List<String> tag, LocalDateTime createdAt) {
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

    public static RestaurantReviewResDto EntityToDto(RestaurantReview restaurantReview) {
        return RestaurantReviewResDto.builder()
                .id(restaurantReview.getId())
                .rating(restaurantReview.getRating())
                .content(restaurantReview.getContent())
                .memberId(restaurantReview.getMember().getId())
                .nickname(restaurantReview.getNickname())
                .thumbnail(restaurantReview.getMember().getThumbnail())
                .createdAt(restaurantReview.getCreatedAt())
                .build();
    }
}
