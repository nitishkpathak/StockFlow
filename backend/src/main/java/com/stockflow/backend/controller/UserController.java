package com.stockflow.backend.controller;

import com.stockflow.backend.entity.User;
import com.stockflow.backend.security.UserResponse;
import com.stockflow.backend.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    // Add user
    @PostMapping
    public UserResponse addUser(
            @RequestBody User user) {

        return userService.addUser(user);
    }

    // Update user
    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return userService.updateUser(id, user);
    }

    // Delete user
    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return "User deleted successfully";
    }
}