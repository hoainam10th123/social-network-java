package com.hoainam10th.socialnetwork.websocket.controller;

import com.hoainam10th.socialnetwork.dtos.CommentDto;
import com.hoainam10th.socialnetwork.dtos.CreateCommentDto;
import com.hoainam10th.socialnetwork.services.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@RequiredArgsConstructor
@Controller
public class CommentController {
    private final CommentService commentService;

    // Principal object to be injected automatically in your controller
    @MessageMapping("/user.addComment")
    @SendTo("/topic/add_comment")
    public CommentDto sendComment(@Payload @Valid CreateCommentDto data, Principal principal){
        data.setUsername(principal.getName());
        return commentService.addComment(data.getPostId(), data);
    }
}
