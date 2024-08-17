package com.hoainam10th.socialnetwork.controller;

import com.hoainam10th.socialnetwork.dtos.CreateCommentDto;
import com.hoainam10th.socialnetwork.dtos.PostDto;
import com.hoainam10th.socialnetwork.helper.PaginationParams;
import com.hoainam10th.socialnetwork.services.CommentService;
import com.hoainam10th.socialnetwork.services.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RequestMapping("/api/posts")
@RestController
public class PostController {
    private final PostService postService;
    private final CommentService commentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping
    public ResponseEntity<Object> add(@RequestBody @Valid PostDto data, Principal principal){
        data.setUsername(principal.getName());
        return new ResponseEntity<>(postService.addPost(data), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<Object> getAllPosts(@RequestParam int pageNumber, @RequestParam(required = false, defaultValue = "20") int pageSize){
        PaginationParams params = new PaginationParams(pageNumber, pageSize);
        return ResponseEntity.ok(postService.findAllPosts(params));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("{id}")
    public ResponseEntity<Object> getPostById(@PathVariable Long id){
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PreAuthorize("@postOwner.isPostOwner(#id)")
    @DeleteMapping("{id}")
    public ResponseEntity<Object> deletePost(@PathVariable Long id){
        Map<String, Long> map = new HashMap<>();
        map.put("id", postService.delPost(id));

        return ResponseEntity.ok(map);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping("like/{id}")
    public ResponseEntity<Object> likePost(@PathVariable Long id, Principal principal){
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("status", postService.likePost(id, principal.getName()));

        return ResponseEntity.ok(map);
    }

    // thay the api nay qua invoke method stomp tu client
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("{postId}/add-comment")
    public ResponseEntity<Object> addComment(@PathVariable Long postId, @RequestBody @Valid CreateCommentDto data, Principal principal){
        data.setUsername(principal.getName());
        return new ResponseEntity<>(commentService.addComment(postId, data), HttpStatus.CREATED);
    }
}
