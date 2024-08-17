package com.hoainam10th.socialnetwork.errors;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ApiValidationErrorResponse extends ApiResponse{
    private List<String> errors;

    public ApiValidationErrorResponse(List<String> errors, String message) {
        super(400, message);
        this.errors = errors;
    }
}
