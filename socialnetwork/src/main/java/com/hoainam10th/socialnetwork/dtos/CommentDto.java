package com.hoainam10th.socialnetwork.dtos;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.hoainam10th.socialnetwork.websocket.data.LocalDateTimeDeserializer;
import com.hoainam10th.socialnetwork.websocket.data.LocalDateTimeSerializer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private UUID id;

    private String content;

    private String ownerUsername;

    private String ownerDisplayName;

    private Long aPostId;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private Instant createdDate;
    // dont add PostDto at here, because it make lifecycle error
}
