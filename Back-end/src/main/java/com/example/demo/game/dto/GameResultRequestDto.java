package com.example.demo.game.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameResultRequestDto {
    private String userId;                 // 어떤 유저인지
    private String classificationResult;   // YOLO 결과 ("CLEAN", "NONPET", "LABEL", "DIRTY" 등)
    private int livesUsed;
    private String playDate;
    private int score;                   // 이번 판 획득 점수
    private int playTime;                // 플레이 시간(초 단위)
}

