package com.hoainam10th.socialnetwork.repositories;

import com.hoainam10th.socialnetwork.entities.UserLikePost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserLikePostRepository extends JpaRepository<UserLikePost, Long> {
    @Query("SELECT u FROM UserLikePost u " + "WHERE u.user.id = :userId AND u.postId = :postId")
    Optional<UserLikePost> existsUserInPost(@Param("userId") Long userId, @Param("postId") Long postId);

    @Query(value = "SELECT COUNT(u) FROM UserLikePost u WHERE u.postId = :postId")
    Long countUserLikeInPost(@Param("postId") Long postId);
}
