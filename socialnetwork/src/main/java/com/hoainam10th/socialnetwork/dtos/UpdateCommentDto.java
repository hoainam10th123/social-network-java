package com.hoainam10th.socialnetwork.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCommentDto {
    @NotBlank(message = "Required content")
    @Length(min = 3, message = "content minimum is 3 character")
    private String content;
}
