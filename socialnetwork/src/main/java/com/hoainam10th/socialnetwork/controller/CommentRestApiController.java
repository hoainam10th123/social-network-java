package com.hoainam10th.socialnetwork.controller;

import com.hoainam10th.socialnetwork.dtos.UpdateCommentDto;
import com.hoainam10th.socialnetwork.services.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RequestMapping("/api/comments")
@RestController
public class CommentRestApiController {

    private final CommentService commentService;


    @PreAuthorize("@postOwner.isCommentOwner(#id)")
    @PutMapping("{id}")
    public ResponseEntity<Object> updateComment(@PathVariable UUID id, @RequestBody @Valid UpdateCommentDto data){
        return ResponseEntity.ok(commentService.updateComment(id, data));
    }
}
