package com.hoainam10th.socialnetwork.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "content")
    private String content;

    @Column(name = "owner_username")
    private String ownerUsername;

    @Column(name = "owner_display_name")
    private String ownerDisplayName;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(name = "a_post_id")
    private Long aPostId;

    @Column(name = "created_date")
    private Instant createdDate;
}
