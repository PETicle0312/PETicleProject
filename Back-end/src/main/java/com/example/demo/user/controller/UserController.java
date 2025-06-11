package com.example.demo.user.controller;

import com.example.demo.school.dto.StudentVerifyDto;
import com.example.demo.school.service.SchoolService;
import com.example.demo.user.dto.*;
import com.example.demo.user.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegisterDto dto) {
        return ResponseEntity.ok(userService.registerUser(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(userService.login(dto));
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<UserRankingDto>> getRanking() {
        return ResponseEntity.ok(userService.getUserRanking());
    }

    @PostMapping("/session/start")
    public ResponseEntity<String> startSession(@RequestBody StartSessionDto dto) {
        userService.startGameSession(dto);
        return ResponseEntity.ok("게임 세션 시작됨");
    }

    @PostMapping("/verify-phone")
    public ResponseEntity<String> verifyPhoneNumber(@RequestBody PhoneVerifyDto dto) {
        String phone = dto.getPhoneNumber();
        if (!phone.matches("^010\\d{7,8}$")) {
            return ResponseEntity.badRequest().body("유효하지 않은 휴대폰 번호 형식입니다.");
        }
        return ResponseEntity.ok("휴대폰 번호 인증 성공");
    }
    

}
