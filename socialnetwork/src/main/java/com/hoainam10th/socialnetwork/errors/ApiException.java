package com.hoainam10th.socialnetwork.errors;

public class ApiException extends ApiResponse{
    public String details;

    public ApiException(int statusCode, String message, String details) {
        super(statusCode, message);
        this.details = details;
    }
}
