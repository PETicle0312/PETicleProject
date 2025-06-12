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
}

