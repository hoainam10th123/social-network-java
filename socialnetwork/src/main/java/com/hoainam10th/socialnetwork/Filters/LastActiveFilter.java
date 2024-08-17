package com.hoainam10th.socialnetwork.Filters;

import com.hoainam10th.socialnetwork.security.JwtTokenProvider;
import com.hoainam10th.socialnetwork.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;



@Component
public class LastActiveFilter extends OncePerRequestFilter {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String bearerToken = request.getHeader("Authorization");

        if(bearerToken != null && bearerToken.startsWith("Bearer ")){
            String token = bearerToken.substring(7); // "Bearer token"

            if(jwtTokenProvider.validateToken(token)){
                String username = jwtTokenProvider.getUsername(token);
                userService.UpdateLastActiveByUsername(username);
            }
        }
        filterChain.doFilter(request, response);
    }
}
