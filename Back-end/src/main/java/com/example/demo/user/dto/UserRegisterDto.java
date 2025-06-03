package com.example.demo.user.dto;

public class UserRegisterDto {
    private String username;
    private String password;
    private String phone;

    // 생성자
    public UserRegisterDto() {}

    public UserRegisterDto(String username, String password, String phone) {
        this.username = username;
        this.password = password;
        this.phone = phone;
    }

    // Getter/Setter
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
