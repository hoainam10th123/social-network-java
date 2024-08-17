package com.hoainam10th.socialnetwork.services;

import com.hoainam10th.socialnetwork.dtos.MessageDto;
import com.hoainam10th.socialnetwork.dtos.MessageSendDto;
import com.hoainam10th.socialnetwork.entities.Message;
import com.hoainam10th.socialnetwork.entities.User;
import com.hoainam10th.socialnetwork.exceptions.NotFoundException;
import com.hoainam10th.socialnetwork.repositories.MessageRepository;
import com.hoainam10th.socialnetwork.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;
import java.time.Instant;
import java.util.List;


@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserRepository userRepository;

    public List<MessageDto> getMessages(String senderUsername, String recipientUsername){
        List<Message> messagesDb = messageRepository.getMessages(senderUsername, recipientUsername);

        return messagesDb.stream().map((msg) -> {
            String content = HtmlUtils.htmlUnescape(msg.getContent());
            msg.setContent(content);
            return modelMapper.map(msg, MessageDto.class);
        }).toList();
    }

    public MessageDto addMessage(MessageSendDto msg, String senderUsername){
        User recipientUser = userRepository.findByUsername(msg.getRecipientUsername())
                .orElseThrow(() -> new NotFoundException("Recipient Username not found: " + msg.getRecipientUsername()));

        User senderUser = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new NotFoundException("Sender username not found: " + senderUsername));


        Message message = new Message();
        message.setSenderUsername(senderUsername);
        message.setRecipientUsername(msg.getRecipientUsername());
        message.setContent(HtmlUtils.htmlEscape(msg.getContent()));
        message.setCreatedDate(Instant.now());
        message.setSenderUser(senderUser);
        message.setRecipientUser(recipientUser);

        Message dataReturn = messageRepository.save(message);
        String content = HtmlUtils.htmlUnescape(msg.getContent());
        dataReturn.setContent(content);
        return modelMapper.map(dataReturn, MessageDto.class);
    }
}
