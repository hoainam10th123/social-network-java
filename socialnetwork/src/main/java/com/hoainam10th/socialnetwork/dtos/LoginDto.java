package com.hoainam10th.socialnetwork.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Setter
@Getter
@AllArgsConstructor
public class LoginDto {
    @NotBlank(message = "Required username")
    private String username;

    @NotBlank(message = "Required password")
    @Length(min = 6, message = "Password min is 6 character")
    private String password;
}