package com.hoainam10th.socialnetwork.websocket.controller;

import com.hoainam10th.socialnetwork.dtos.MessageCaller;
import com.hoainam10th.socialnetwork.dtos.MessageSendDto;
import com.hoainam10th.socialnetwork.dtos.UserDto;
import com.hoainam10th.socialnetwork.exceptions.BadRequestException;
import com.hoainam10th.socialnetwork.exceptions.NotFoundException;
import com.hoainam10th.socialnetwork.services.MessageService;
import com.hoainam10th.socialnetwork.services.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;


@RequiredArgsConstructor
@Controller
public class MessageController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @MessageMapping("/user.sendMessage")
    @SendToUser("/topic/reply")// ban toi caller
    public Map<String, Object> sendMessage(@Payload MessageSendDto msg, Principal principal){
        if(msg.getRecipientUsername().equals(principal.getName()))
            throw new BadRequestException("Can not send message yourself");

        var message = messageService.addMessage(msg, principal.getName());
        var user = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new NotFoundException("Can not find user with username: "+principal.getName()));

        Map<String, Object> map = new HashMap<>();
        map.put("group", getGroupName(principal.getName(), msg.getRecipientUsername()));
        map.put("message", message);
        map.put("senderUser", modelMapper.map(user, UserDto.class));

        messagingTemplate.convertAndSendToUser(msg.getRecipientUsername(), "/queue/messages", map);
        return map;
    }

    @MessageMapping("/user.loadMessages")
    @SendToUser("/topic/caller")
    public MessageCaller getMessages(@Payload String recipientUsername, Principal principal){
        String currentUsername = principal.getName();
        String groupName = getGroupName(currentUsername, recipientUsername);

        var messages = messageService.getMessages(currentUsername, recipientUsername);

        return new MessageCaller(groupName, messages);
    }

    private String getGroupName(String username, String recipientUsername){
        int result = username.compareToIgnoreCase(recipientUsername);
        if(result > 0)
            return username+"-"+recipientUsername;
        return recipientUsername+"-"+username;
    }
}
