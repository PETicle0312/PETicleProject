package com.example.demo.game.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GameResultResponseDto {
    private String message;    // 처리 결과 메시지
    private int score;         // 현재 점수
    private int totalLives;     // 현재 목숨 수
    private int totalScore;    //누적 목숨 수
}

