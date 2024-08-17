package com.hoainam10th.socialnetwork.dtos;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.hoainam10th.socialnetwork.websocket.data.LocalDateTimeDeserializer;
import com.hoainam10th.socialnetwork.websocket.data.LocalDateTimeSerializer;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class PostDto {
    private Long id;

    private String username;

    @NotBlank(message = "Required content")
    @Length(min = 10, message = "min is 10 character")
    private String content;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private Instant createdDate;

    private UserDto user;
    private Long totalLikes = 0L;
    private boolean ownerUserLikePost;
    private Set<CommentDto> comments = new HashSet<>();
}
