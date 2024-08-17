package com.hoainam10th.socialnetwork.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_username")
    private String senderUsername;

    @Column(name = "recipient_username")
    private String recipientUsername;

    @Column(name = "content")
    private String content;

    @Column(name = "created_date")
    private Instant createdDate;

    @ManyToOne
    @JoinColumn(name="user_sender_id")
    private User senderUser;

    @ManyToOne
    @JoinColumn(name="user_recipient_id")
    private User recipientUser;
}
