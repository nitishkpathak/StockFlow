package com.stockflow.backend.config;

import com.stockflow.backend.entity.User;
import com.stockflow.backend.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@stockflow.com";

            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setName("StockFlow Admin");
                admin.setEmail(adminEmail);

                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );

                admin.setRole("ADMIN");

                userRepository.save(admin);

                System.out.println(
                        "Default ADMIN account created."
                );

            } else {

                System.out.println(
                        "ADMIN account already exists."
                );
            }
        };
    }
}