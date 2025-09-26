package com.example.demo.game.controller;

import com.example.demo.game.dto.GameResultRequestDto;
import com.example.demo.game.dto.GameResultResponseDto;
import com.example.demo.game.entity.GameSession;
import com.example.demo.game.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping("/submit")
    public ResponseEntity<GameResultResponseDto> submitResult(@RequestBody GameResultRequestDto dto) {
        GameResultResponseDto response = gameService.processGameResult(dto);
        return ResponseEntity.ok(response);
    }
        @PostMapping("/record")
    public ResponseEntity<GameSession> recordGame(
            @RequestParam String userId,
            @RequestParam int score,
            @RequestParam int playTimeSec) {

        GameSession session = gameService.recordGame(userId, score, playTimeSec);
        return ResponseEntity.ok(session);
    }
}

