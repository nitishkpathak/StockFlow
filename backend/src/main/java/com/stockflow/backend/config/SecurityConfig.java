package com.stockflow.backend.config;

import com.stockflow.backend.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }


    // Password hashing
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // CORS configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        String frontendUrl = System.getenv("FRONTEND_URL");

        if (frontendUrl == null || frontendUrl.isBlank()) {
            frontendUrl = "http://localhost:3000";
        }

        configuration.setAllowedOrigins(
                List.of(frontendUrl)
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // Spring Security rules
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // Disable CSRF for REST API
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors -> {})

                // JWT based authentication
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow browser preflight requests
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()


                        // PUBLIC AUTH APIs
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        // =========================
                        // CATEGORIES
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/categories/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/categories/**"
                        ).hasRole("ADMIN")


                        // =========================
                        // SUPPLIERS
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/suppliers/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/suppliers/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/suppliers/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/suppliers/**"
                        ).hasRole("ADMIN")


                        // =========================
                        // PRODUCTS
                        // =========================

                        // ADMIN + STAFF can view products
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF"
                        )

                        // Only ADMIN can add products
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        // Only ADMIN can update products
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        // Only ADMIN can delete products
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**"
                        ).hasRole("ADMIN")


                        // =========================
                        // STOCK TRANSACTIONS
                        // =========================

                        // ADMIN + STAFF can view stock history
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/stock-transactions/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF"
                        )


                        // =========================
                        // USERS
                        // =========================

                        // Only ADMIN can manage users
                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")


                        // Everything else requires login
                        .anyRequest().authenticated()
                )


                // JWT filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}