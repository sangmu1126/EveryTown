package com.inha.everytown.domain.board.entity.document;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import javax.persistence.Id;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Document(indexName = "board")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Mapping(mappingPath = "elastic/board-mapping.json")
@Setting(settingPath = "elastic/analysis-setting.json")
public class BoardDoc {

    @Id
    private Long id;

    @Field(name = "board_category_id")
    private Long board_category_id;

    @Field(name = "category")
    private String category;

    @Field(name = "member_id")
    private Long member_id;

    @Field(name = "nickname")
    private String nickname;

    @Field(name = "title")
    private String title;

    @Field(name = "content")
    private String content;

    @Field(name = "address")
    private String address;

    @Field(name = "view_cnt")
    private Long viewCnt;

    @Field(name = "comment_cnt")
    private Long commentCnt;

    @Field(name = "like_cnt")
    private Long likeCnt;

    @Field(name = "location")
    private GeoPoint location;

    @Field(name = "created_at")
    private LocalDateTime created_at;

    @Field(name = "modified_at")
    private LocalDateTime modified_at;

    public LocalDateTime getCreated_at() {
        ZonedDateTime zonedDateTimeUtc = ZonedDateTime.of(created_at, ZoneId.of("UTC"));
        ZonedDateTime zonedDateTimeKST = zonedDateTimeUtc.withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        return zonedDateTimeKST.toLocalDateTime();
    }

    public LocalDateTime getModified_at() {
        ZonedDateTime zonedDateTimeUtc = ZonedDateTime.of(modified_at, ZoneId.of("UTC"));
        ZonedDateTime zonedDateTimeKST = zonedDateTimeUtc.withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        return zonedDateTimeKST.toLocalDateTime();
    }
}
