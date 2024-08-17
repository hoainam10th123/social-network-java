package com.hoainam10th.socialnetwork.exceptions;


import com.hoainam10th.socialnetwork.errors.ApiException;
import com.hoainam10th.socialnetwork.errors.ApiResponse;
import com.hoainam10th.socialnetwork.errors.ApiValidationErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.*;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        final String message = ex.getMessage();
        if(Objects.equals(message, "Bad credentials")){
            return new ResponseEntity<>(new ApiResponse(400, "Invalid password"), HttpStatus.BAD_REQUEST);
        }
        else if(Objects.equals(message, "Access Denied")){
            return new ResponseEntity<>(new ApiResponse(403, "You are not allow to do that"), HttpStatus.FORBIDDEN);
        }else{
            String stackTrace = Arrays.stream(ex.getStackTrace()).map(msg-> String.format("%s %n", msg.toString())).collect(Collectors.joining());
            return new ResponseEntity<>(new ApiException(500, ex.getMessage(), stackTrace), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequestException(BadRequestException ex) {
        return new ResponseEntity<>(new ApiResponse(400, ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException ex) {
        List<String> errors = new ArrayList<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            //String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.add(errorMessage);
        });

        return new ResponseEntity<>(new ApiValidationErrorResponse(errors, ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(NotFoundException ex) {
        return new ResponseEntity<>(new ApiResponse(404, ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnAuthorizedException.class)
    public ResponseEntity<Object> handleUnAuthorizedException(UnAuthorizedException ex) {
        return new ResponseEntity<>(new ApiResponse(401, ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Object> handleForbiddenException(ForbiddenException ex) {
        return new ResponseEntity<>(new ApiResponse(403, ex.getMessage()), HttpStatus.FORBIDDEN);
    }
}
