package com.example.demo.admin.controller;

import com.example.demo.admin.dto.AdminLoginRequestDto;
import com.example.demo.admin.dto.AdminLoginResponseDto;
import com.example.demo.admin.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

     @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequestDto dto) {
        System.out.println("🔵 [요청 도착] 로그인 시도: " + dto.getAdminId() + ", " + dto.getPassword());

        AdminLoginResponseDto result = adminService.login(dto);
        if (result != null) {
            return ResponseEntity.ok(result); // 로그인 성공 시 관리자 + 학교 리스트 반환
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }


}
