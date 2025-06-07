package com.example.demo.user.dto;

import lombok.Data;

@Data
public class UserRegisterDto {
    private String userId;
    private String password;
    private String mobile;
    private String name;
    private String schoolName;       // 학교 이름만 받는 경우
    //private String studentNumber;
}