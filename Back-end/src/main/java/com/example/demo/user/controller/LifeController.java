package com.example.demo.user.controller;

import com.example.demo.user.service.LifeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/lives")   // ✅ 하트 API 전용 prefix
public class LifeController {

    private final LifeService lifeService;

    // 현재 하트 조회: GET /api/lives?userId=...
    @GetMapping
    public ResponseEntity<?> lives(@RequestParam("userId") String userId) {
        try {
            int lives = lifeService.currentLives(userId);
            return ResponseEntity.ok(lives);
        } catch (IllegalStateException e) {
            if ("USER_NOT_FOUND".equals(e.getMessage())) {
                return ResponseEntity.badRequest().body("사용자를 찾을 수 없습니다.");
            }
            return ResponseEntity.badRequest().body("요청 오류");
        }
    }

    // 하트 차감: POST /api/lives/consume?userId=...
    @PostMapping("/consume")
    public ResponseEntity<?> consume(@RequestParam("userId") String userId) {
        try {
            int remaining = lifeService.consumeOne(userId);
            return ResponseEntity.ok(remaining); // 남은 하트 수
        } catch (IllegalStateException e) {
            if ("NO_LIFE".equals(e.getMessage())) {
                return ResponseEntity.status(409).body("하트가 없습니다.");
            }
            if ("USER_NOT_FOUND".equals(e.getMessage())) {
                return ResponseEntity.badRequest().body("사용자를 찾을 수 없습니다.");
            }
            return ResponseEntity.badRequest().body("요청 오류");
        }
    }
}
