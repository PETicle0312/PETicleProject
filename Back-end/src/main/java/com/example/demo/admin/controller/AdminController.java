package com.example.demo.admin.controller;

import com.example.demo.admin.dto.AdminLoginRequestDto;
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
    public ResponseEntity<String> login(@RequestBody AdminLoginRequestDto dto) {
        System.out.println("🔵 [요청 도착] 로그인 시도: " + dto.getAdminId() + ", " + dto.getPassword());
        boolean success = adminService.login(dto);
        if (success) {
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }
}
