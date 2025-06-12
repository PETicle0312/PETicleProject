package com.example.demo.user.dto;

import lombok.Data;

@Data
public class UserRegisterDto {
    private String userId;
    private String password;
    private String confirmPassword;
    private String name;
    private String phone;
    private String studentNumber;
    private String schoolId;
    private String charName;
    private String imageUrl;

}