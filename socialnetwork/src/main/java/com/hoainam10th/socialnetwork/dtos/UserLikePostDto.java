package com.hoainam10th.socialnetwork.dtos;

import com.hoainam10th.socialnetwork.entities.Post;
import com.hoainam10th.socialnetwork.entities.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserLikePostDto {
    private Long id;

    private UserDto user;

    private Long postId;
}
