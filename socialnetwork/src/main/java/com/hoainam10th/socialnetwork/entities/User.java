package com.hoainam10th.socialnetwork.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    private Set<Role> roles = new HashSet<>();

    @Column(name = "last_active")
    private Instant lastActive;

    @OneToMany(mappedBy = "senderUser")
    private Set<Message> MessagesSent;

    @OneToMany(mappedBy = "recipientUser")
    private Set<Message> MessagesReceived;

    @OneToMany(mappedBy = "user")
    private List<Post> posts;


    @OneToMany(mappedBy = "user")
    private Set<UserLikePost> userLikePost;

    public User(String name, String username, String password, Instant lastActive){
        this.name = name;
        this.username = username;
        this.password = password;
        this.lastActive = lastActive;
    }
}
