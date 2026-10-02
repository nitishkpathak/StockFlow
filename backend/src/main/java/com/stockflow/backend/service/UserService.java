package com.stockflow.backend.service;

import com.stockflow.backend.entity.Company;
import com.stockflow.backend.entity.User;
import com.stockflow.backend.repository.CompanyRepository;
import com.stockflow.backend.repository.UserRepository;
import com.stockflow.backend.security.AuthResponse;
import com.stockflow.backend.security.JwtService;
import com.stockflow.backend.security.RegisterRequest;
import com.stockflow.backend.security.UserResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CompanyRepository companyRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            CompanyRepository companyRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.companyRepository = companyRepository;
    }

    // Get current logged-in user's company ID
    private Long getCurrentCompanyId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                authentication.getCredentials() == null) {

            throw new RuntimeException(
                    "Company information not found"
            );
        }

        return (Long) authentication.getCredentials();
    }

    // Get current company
    private Company getCurrentCompany() {

        Long companyId = getCurrentCompanyId();

        return companyRepository
                .findById(companyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company not found"
                        ));
    }

    // Register company and first admin
    @Transactional
    public User registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Create company
        Company company = new Company();

        company.setName(request.getCompanyName());
        company.setEmail(request.getCompanyEmail());
        company.setPhone(request.getCompanyPhone());
        company.setAddress(request.getCompanyAddress());

        Company savedCompany =
                companyRepository.save(company);

        // Create first user
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // First user of a company is always ADMIN
        user.setRole("ADMIN");

        // Assign newly created company
        user.setCompany(savedCompany);

        return userRepository.save(user);
    }

    // Login user
    public AuthResponse loginUser(
            String email,
            String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        ));

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        if (user.getCompany() == null) {

            throw new RuntimeException(
                    "User is not assigned to any company"
            );
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole(),
                user.getCompany().getId()
        );

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCompany().getId(),
                user.getCompany().getName()
        );
    }

    // Get all users of current company
    public List<UserResponse> getAllUsers() {

        Long companyId = getCurrentCompanyId();

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getCompany() != null &&
                        user.getCompany()
                                .getId()
                                .equals(companyId))
                .map(this::toUserResponse)
                .toList();
    }

    // Add user to current company
    public UserResponse addUser(User user) {

        Company company = getCurrentCompany();

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException(
                    "Email already registered"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        if (user.getRole() == null ||
                user.getRole().isBlank()) {

            user.setRole("STAFF");
        }

        user.setCompany(company);

        User savedUser =
                userRepository.save(user);

        return toUserResponse(savedUser);
    }

    // Update user of current company
    public UserResponse updateUser(
            Long id,
            User updatedUser) {

        Long companyId = getCurrentCompanyId();

        User existingUser =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        if (existingUser.getCompany() == null ||
                !existingUser.getCompany()
                        .getId()
                        .equals(companyId)) {

            throw new RuntimeException(
                    "User not found"
            );
        }

        if (!existingUser.getEmail()
                .equals(updatedUser.getEmail())
                && userRepository.existsByEmail(
                        updatedUser.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        existingUser.setName(
                updatedUser.getName()
        );

        existingUser.setEmail(
                updatedUser.getEmail()
        );

        existingUser.setRole(
                updatedUser.getRole()
        );

        if (updatedUser.getPassword() != null &&
                !updatedUser.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            updatedUser.getPassword()
                    )
            );
        }

        User savedUser =
                userRepository.save(existingUser);

        return toUserResponse(savedUser);
    }

    // Delete user of current company
    public void deleteUser(Long id) {

        Long companyId = getCurrentCompanyId();

        User existingUser =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        if (existingUser.getCompany() == null ||
                !existingUser.getCompany()
                        .getId()
                        .equals(companyId)) {

            throw new RuntimeException(
                    "User not found"
            );
        }

        userRepository.delete(existingUser);
    }

    // Convert User to safe response
    private UserResponse toUserResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}