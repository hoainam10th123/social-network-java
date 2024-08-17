package com.hoainam10th.socialnetwork.repositories;

import com.hoainam10th.socialnetwork.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
}
