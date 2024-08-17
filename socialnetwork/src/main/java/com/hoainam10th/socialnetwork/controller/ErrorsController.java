package com.hoainam10th.socialnetwork.controller;


import com.hoainam10th.socialnetwork.dtos.PostDto;
import com.hoainam10th.socialnetwork.exceptions.BadRequestException;
import com.hoainam10th.socialnetwork.exceptions.ForbiddenException;
import com.hoainam10th.socialnetwork.exceptions.NotFoundException;
import com.hoainam10th.socialnetwork.exceptions.UnAuthorizedException;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


@RequestMapping("/api/errors")
@RestController
public class ErrorsController {
    @GetMapping("not-found")
    public ResponseEntity<Object> get404NotFound(){
        throw new NotFoundException("Khong thay object");
    }

    @GetMapping("bad-request")
    public ResponseEntity<Object> get400BadRequest(){
        throw new BadRequestException("khong tim thay id");
    }

    @GetMapping("unauthorized")
    public ResponseEntity<Object> get401Unauthorized(){
        throw new UnAuthorizedException("Ban Chua dang nhap");
    }

    @GetMapping("forbidden")
    public ResponseEntity<Object> get403Forbidden(){
        throw new ForbiddenException("Ban khong co quyen truy cap tai nguyen nay");
    }

    @GetMapping("server-error")
    public ResponseEntity<Object> get500ServerError() {
        throw new RuntimeException("500 server-error");
    }

    @PostMapping("validation")
    public ResponseEntity<Object> get400Validation(@Valid @RequestBody PostDto todo) {
        return  ResponseEntity.ok("Validate thanh cong");
    }
}
