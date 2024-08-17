package com.hoainam10th.socialnetwork.controller;


import com.hoainam10th.socialnetwork.dtos.LoginDto;
import com.hoainam10th.socialnetwork.dtos.RegisterDto;
import com.hoainam10th.socialnetwork.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@AllArgsConstructor
@RequestMapping("/api/account")
@RestController
public class AccountController {
    private final UserService authService;

    @PostMapping("register")
    public ResponseEntity<Object> register(@RequestBody @Valid RegisterDto data){
        return ResponseEntity.ok(authService.register(data));
    }

    @PostMapping("login")
    public ResponseEntity<Object> login(@RequestBody @Valid LoginDto data){
        return ResponseEntity.ok(authService.login(data));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("user")
    public ResponseEntity<Object> login(){

        return ResponseEntity.ok(authService.getCurrentUsername());
    }
}
