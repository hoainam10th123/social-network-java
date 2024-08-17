package com.hoainam10th.socialnetwork.websocket.controller;


import com.hoainam10th.socialnetwork.dtos.UserDto;
import com.hoainam10th.socialnetwork.entities.User;
import com.hoainam10th.socialnetwork.exceptions.NotFoundException;
import com.hoainam10th.socialnetwork.services.UserService;
import com.hoainam10th.socialnetwork.websocket.data.PresenceTracker;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Controller
public class PresenceController {
    private final PresenceTracker presenceTracker;
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/user.onConnected")
    @SendTo("/topic/broadcast")
    public UserDto userOnConnected(Principal principal){// Principal object to be injected automatically in your controller
        String username = principal.getName();
        presenceTracker.UserConnected(username);

        Optional<User> user = userService.findByUsername(username);
        if(user.isEmpty()) throw new NotFoundException("Cannot find user with username = "+username);
        //send users online to caller
        messagingTemplate.convertAndSendToUser(username, "/queue/online_users", getUsersOnline());

        // get messages
        return user.map(value -> modelMapper.map(value, UserDto.class)).orElse(null);
    }

    @MessageMapping("/user.onDisconnected")
    @SendTo("/topic/broadcast")
    public String userOnDisconnected(Principal principal){
        String username = principal.getName();
        presenceTracker.UserDisconnected(username);
        return username;
    }

    private List<UserDto> getUsersOnline(){
        String[] usersOnline = presenceTracker.GetOnlineUsers();

        return Arrays.stream(usersOnline).map((mapUsername) -> {
            Optional<User> userDb = userService.findByUsername(mapUsername);
            return userDb.map(value -> modelMapper.map(value, UserDto.class)).orElse(null);
        }).toList();
    }
}
