package com.example.demo.admin.dto;

public class PasswordChangeRequestDto {
    private Long adminId;  // ✅ 추가!
    private String currentPassword;
    private String newPassword;

    public PasswordChangeRequestDto() {}

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
