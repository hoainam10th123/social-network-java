package com.hoainam10th.socialnetwork.security;

import com.hoainam10th.socialnetwork.entities.Comment;
import com.hoainam10th.socialnetwork.entities.Post;
import com.hoainam10th.socialnetwork.exceptions.NotFoundException;
import com.hoainam10th.socialnetwork.repositories.CommentRepository;
import com.hoainam10th.socialnetwork.repositories.PostRepository;
import com.hoainam10th.socialnetwork.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class PostOwner {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CommentRepository commentRepository;

    public boolean isPostOwner(Long id) {
        Post todo = postRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Not found id = "+id));

        return todo.getUsername().equalsIgnoreCase(userService.getCurrentUsername());
    }

    public boolean isCommentOwner(UUID id) {
        Comment todo = commentRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Not found id = "+id));

        return todo.getOwnerUsername().equalsIgnoreCase(userService.getCurrentUsername());
    }
}
