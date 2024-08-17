package com.hoainam10th.socialnetwork.services;

import com.hoainam10th.socialnetwork.dtos.LoginDto;
import com.hoainam10th.socialnetwork.dtos.RegisterDto;
import com.hoainam10th.socialnetwork.dtos.UserDto;
import com.hoainam10th.socialnetwork.entities.Role;
import com.hoainam10th.socialnetwork.entities.User;
import com.hoainam10th.socialnetwork.exceptions.BadRequestException;
import com.hoainam10th.socialnetwork.repositories.RoleRepository;
import com.hoainam10th.socialnetwork.repositories.UserRepository;
import com.hoainam10th.socialnetwork.security.JwtTokenProvider;
import com.hoainam10th.socialnetwork.utils.Utilities;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.*;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private RoleRepository roleRepository;

    public String getCurrentUsername(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Utilities.getUsername(auth);
    }

    public Optional<User> findByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public String register(RegisterDto data) {
        Optional<User> user = userRepository.findByUsername(data.getUsername());
        if(user.isEmpty()){
            User entity = modelMapper.map(data, User.class);
            entity.setPassword(passwordEncoder.encode(data.getPassword()));

            Role role = roleRepository.findByName("user");
            Set<Role> roles = new HashSet<>();
            roles.add(role);

            entity.setRoles(roles);

            userRepository.save(entity);
        }else{
            throw new BadRequestException("Username is exist");
        }
        return "Register success";
    }

    public Map<String,Object> login(LoginDto data) {
        Optional<User> user = userRepository.findByUsername(data.getUsername());

        if(user.isEmpty()) throw new BadRequestException("Invalid username or email");

        //sai pass quang ra loi 500; khi handle loi 500 custom lai thanh 400
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                data.getUsername(),
                data.getPassword()
        ));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication, user.get().getRoles());

        Map<String,Object> map = new HashMap<>();
        map.put("token", token);
        map.put("user", modelMapper.map(user.get(), UserDto.class));

        return map;
    }

    public void UpdateLastActiveByUsername(String username){
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isPresent()){
            var userDb = user.get();
            userDb.setLastActive(Instant.now());
            userRepository.save(userDb);
        }
    }
}
