package com.hoainam10th.socialnetwork.repositories;

import com.hoainam10th.socialnetwork.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query(value = "SELECT m FROM Message m WHERE m.recipientUsername = ?1 AND m.senderUsername = ?2 OR m.recipientUsername = ?2 AND m.senderUsername = ?1")
    List<Message> getMessages(String senderUsername, String recipientUsername);
}
