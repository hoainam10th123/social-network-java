package com.hoainam10th.socialnetwork.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    @NotBlank(message = "Required name")
    private String name;

    @NotBlank(message = "Required username")
    private String username;

    @NotBlank(message = "Required password")
    @Length(min = 6, message = "password min is 6 charactor")
    private String password;
}
