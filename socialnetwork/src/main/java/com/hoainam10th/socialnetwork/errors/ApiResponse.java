package com.hoainam10th.socialnetwork.errors;

public class ApiResponse {
    public int statusCode;
    public String message;

    public ApiResponse(int statusCode, String message){
        this.statusCode = statusCode;
        this.message = message;
    }

//    private String getMessage(){
//        return switch (statusCode) {
//            case 400 -> "A bad request, you have made";
//            case 401 -> "Authorized, you are not";
//            case 403 -> "Forbidden";
//            case 404 -> "Resource found, it was not";
//            case 500 -> "Internal server error";
//            default -> String.format("Stastus code %s unknown message error", statusCode);
//        };
//    }
}
