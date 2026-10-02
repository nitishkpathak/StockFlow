package com.stockflow.backend.security;

public class AuthResponse {

    private String token;
    private Long id;
    private String name;
    private String email;
    private String role;

    private Long companyId;
    private String companyName;

    public AuthResponse() {
    }

    public AuthResponse(
            String token,
            Long id,
            String name,
            String email,
            String role,
            Long companyId,
            String companyName) {

        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.companyId = companyId;
        this.companyName = companyName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}