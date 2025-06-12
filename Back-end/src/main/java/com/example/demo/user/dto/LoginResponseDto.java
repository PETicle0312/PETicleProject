package com.example.demo.user.dto;

public class LoginResponseDto {
    private String message; // 로그인 메시지
    private boolean success; // 로그인 성공 여부

    public LoginResponseDto(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    // Getter and Setter
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
