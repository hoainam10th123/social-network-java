package com.hoainam10th.socialnetwork.services;

import com.hoainam10th.socialnetwork.dtos.PostDto;
import com.hoainam10th.socialnetwork.entities.Post;
import com.hoainam10th.socialnetwork.entities.User;
import com.hoainam10th.socialnetwork.entities.UserLikePost;
import com.hoainam10th.socialnetwork.exceptions.NotFoundException;
import com.hoainam10th.socialnetwork.helper.Pagination;
import com.hoainam10th.socialnetwork.helper.PaginationParams;
import com.hoainam10th.socialnetwork.repositories.PostRepository;
import com.hoainam10th.socialnetwork.repositories.UserLikePostRepository;
import com.hoainam10th.socialnetwork.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;


@RequiredArgsConstructor
@Service
public class PostService {
    private final PostRepository postRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final UserLikePostRepository userLikePostRepository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    public PostDto addPost(PostDto postDto){
        User user = userRepository.findByUsername(postDto.getUsername())
                .orElseThrow(()-> new NotFoundException("not found username: "+ postDto.getUsername()));

        String enCode = HtmlUtils.htmlEscape(postDto.getContent());
        postDto.setContent(enCode);

        Post post = modelMapper.map(postDto, Post.class);
        post.setCreatedDate(Instant.now());
        post.setUser(user);

        Post returnPost = postRepository.save(post);
        String decode = HtmlUtils.htmlUnescape(postDto.getContent());
        returnPost.setContent(decode);

        return modelMapper.map(returnPost, PostDto.class);
    }

    public Long delPost(Long id){
        var post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Not found post with id="+id));

        postRepository.deleteById(id);
        return id;
    }

    public Pagination<PostDto> findAllPosts(PaginationParams params){
        Pageable pageable = PageRequest.of(params.getPageNumber() - 1,
                params.getPageSize(),
                Sort.by("createdDate").descending());

        Page<Post> listData = postRepository.findAll(pageable);

        List<Post> realListTodos = listData.getContent();

        var username = userService.getCurrentUsername();
        var user = userRepository.findByUsername(username).orElseThrow(() -> new NotFoundException("Not found username = "+ username));

        List<PostDto> todosMapped = realListTodos.stream().map((todo) -> {
            String content = HtmlUtils.htmlUnescape(todo.getContent());
            todo.setContent(content);
            PostDto postDto = modelMapper.map(todo, PostDto.class);
            postDto.setTotalLikes(userLikePostRepository.countUserLikeInPost(todo.getId()));

            Optional<UserLikePost> existUser = userLikePostRepository.existsUserInPost(user.getId(), todo.getId());
            postDto.setOwnerUserLikePost(existUser.isPresent());
            return postDto;
        }).toList();

        return new Pagination<>(params.getPageNumber(), params.getPageSize(), postRepository.count(), todosMapped);
    }

    public boolean likePost(Long postId, String username){
        User user = userRepository.findByUsername(username).orElseThrow(()-> new NotFoundException("Not found username: "+username));
        Post post = postRepository.findById(postId).orElseThrow(()-> new NotFoundException("Not found post id: "+postId));
        Optional<UserLikePost> existUser = userLikePostRepository.existsUserInPost(user.getId(), postId);

        if(existUser.isEmpty()){
            UserLikePost userLikePost = new UserLikePost();
            userLikePost.setUser(user);
            userLikePost.setPostId(postId);
            userLikePostRepository.save(userLikePost);
            // cannot send to yourself
            if(!post.getUsername().equals(username))
                messagingTemplate.convertAndSendToUser(post.getUsername(), "/topic/like", user.getUsername() + " like your post");
            return true;
        }else {
            userLikePostRepository.deleteById(existUser.get().getId());
            return false;
        }
    }

    public PostDto getPostById(Long postId){
        Post post = postRepository.findById(postId).orElseThrow(()-> new NotFoundException("Not found post id: "+ postId));
        return modelMapper.map(post, PostDto.class);
    }
}
