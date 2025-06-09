package com.example.demo.user.dto;

import lombok.Data;

@Data
public class UserRegisterDto {
    private String userId;
    private String password;
    private String confirmPassword; // 비밀번호 확인
    private String phone;           // → User 엔티티에서는 mobile이지만, setter로 매핑 가능
    private String name;
    private String studentNumber;
    private String schoolId; // ✅ schoolId로 받아서 schoolRepository로 조회
}