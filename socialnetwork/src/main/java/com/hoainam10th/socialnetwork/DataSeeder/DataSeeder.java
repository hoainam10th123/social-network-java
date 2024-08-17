package com.hoainam10th.socialnetwork.DataSeeder;

import com.hoainam10th.socialnetwork.entities.Role;
import com.hoainam10th.socialnetwork.entities.User;
import com.hoainam10th.socialnetwork.repositories.RoleRepository;
import com.hoainam10th.socialnetwork.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.Instant;


@AllArgsConstructor
@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() == 0){

            Role adminRole = new Role("ROLE_ADMIN");
            Role userRole = new Role("ROLE_USER");

            Role savedAdminRole = roleRepository.save(adminRole);
            Role savedUserRole = roleRepository.save(userRole);

            User hoainam10th = new User(
                    "Nguyen Hoai Nam",
                    "hoainam10th", passwordEncoder.encode("123456"),
                    Instant.now());

            User ubuntu = new User(
                    "Ubuntu Nguyen",
                    "ubuntu", passwordEncoder.encode("123456"),
                    Instant.now());

            User admin = new User(
                    "Administrator",
                    "admin", passwordEncoder.encode("123456"),
                    Instant.now());

            User returnHoainam10th = userRepository.save(hoainam10th);
            User returnUbuntu = userRepository.save(ubuntu);
            User returnAdmin = userRepository.save(admin);

            returnHoainam10th.getRoles().add(savedUserRole);
            returnUbuntu.getRoles().add(savedUserRole);
            returnAdmin.getRoles().add(savedUserRole);
            returnAdmin.getRoles().add(savedAdminRole);

            userRepository.save(returnHoainam10th);
            userRepository.save(returnUbuntu);
            userRepository.save(returnAdmin);
        }
    }
}
