package com.hoainam10th.socialnetwork.services;

import com.hoainam10th.socialnetwork.dtos.CommentDto;
import com.hoainam10th.socialnetwork.dtos.CreateCommentDto;
import com.hoainam10th.socialnetwork.dtos.UpdateCommentDto;
import com.hoainam10th.socialnetwork.entities.Comment;
import com.hoainam10th.socialnetwork.entities.Post;
import com.hoainam10th.socialnetwork.entities.User;
import com.hoainam10th.socialnetwork.exceptions.NotFoundException;
import com.hoainam10th.socialnetwork.repositories.CommentRepository;
import com.hoainam10th.socialnetwork.repositories.PostRepository;
import com.hoainam10th.socialnetwork.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public CommentDto addComment(Long postId, CreateCommentDto data){
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Not found post id: "+ postId));
        User user = userRepository.findByUsername(data.getUsername()).orElseThrow(() -> new NotFoundException("Not found username: "+ data.getUsername()));

        Comment cmt = new Comment();
        cmt.setAPostId(postId);
        cmt.setContent(data.getContent());
        cmt.setPost(post);
        cmt.setOwnerUsername(data.getUsername());
        cmt.setOwnerDisplayName(user.getName());
        cmt.setCreatedDate(Instant.now());

        var commentDb = commentRepository.save(cmt);

        return modelMapper.map(commentDb, CommentDto.class);
    }

    public CommentDto updateComment(UUID commentId, UpdateCommentDto data){
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new NotFoundException("Not found comment"));

        comment.setContent(data.getContent());

        Comment returnCmt = commentRepository.save(comment);

        return modelMapper.map(returnCmt, CommentDto.class);
    }
}
