package com.example.demo.user.controller;

import com.example.demo.user.dto.LoginRequestDto;
import com.example.demo.user.dto.RegisterRequestDto;
import com.example.demo.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ✅ 회원가입 요청
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto dto) {
        String result = authService.register(dto);
        return ResponseEntity.ok(result);
    }
    // ✅ 로그인 요청
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto dto) {
        String result = authService.login(dto);

        if ("로그인 실패".equals(result)) {
            // 로그인 실패 시 401 Unauthorized 응답
            return ResponseEntity.status(401).body(result);
        }

        return ResponseEntity.ok(result); // 로그인 성공 시 200 OK
    }
}
