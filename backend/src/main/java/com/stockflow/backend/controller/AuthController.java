package com.stockflow.backend.controller;

import com.stockflow.backend.entity.User;
import com.stockflow.backend.security.AuthResponse;
import com.stockflow.backend.security.RegisterRequest;
import com.stockflow.backend.security.UserResponse;
import com.stockflow.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            User registeredUser =
                    userService.registerUser(request);

            UserResponse response =
                    new UserResponse(
                            registeredUser.getId(),
                            registeredUser.getName(),
                            registeredUser.getEmail(),
                            registeredUser.getRole()
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            if ("Email already registered"
                    .equals(e.getMessage())) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Email already registered");
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        return userService.loginUser(
                request.getEmail(),
                request.getPassword()
        );
    }

    public static class LoginRequest {

        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}