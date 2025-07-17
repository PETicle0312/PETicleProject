package com.example.demo.admin.dto;

public class AdminLoginRequestDto {
    private String adminId;
    private String password;

    // ✅ 기본 생성자
    public AdminLoginRequestDto() {}
    
    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
