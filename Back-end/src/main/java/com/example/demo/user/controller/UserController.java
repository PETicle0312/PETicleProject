package com.example.demo.user.controller;

import com.example.demo.school.dto.StudentVerifyDto;
import com.example.demo.school.service.SchoolService;
import com.example.demo.user.dto.*;
import com.example.demo.user.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public String registerUser(@RequestBody UserRegisterDto dto) {
        if (dto == null) {
            System.out.println("❌ DTO가 null입니다!");
            return "입력된 데이터가 잘못되었습니다.";
        }

        System.out.println("✅ DTO 확인: " + dto.toString());
        return userService.registerUser(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto dto) {
        System.out.println("Controller 진입");
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

    // 아이디 중복 확인
    @PostMapping("/check-id")
    public ResponseEntity<?> checkId(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        if (userId == null || userId.isBlank()) {
            return ResponseEntity.badRequest().body("userId 누락됨");
        }

        boolean exists = userService.checkUserIdDuplicate(userId);
        if (exists) {
            return ResponseEntity.ok("이미 존재하는 아이디입니다.");
        } else {
            return ResponseEntity.ok("사용 가능한 아이디입니다.");
        }
    }
}
