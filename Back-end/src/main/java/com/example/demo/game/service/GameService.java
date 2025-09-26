package com.example.demo.game.service;

import com.example.demo.game.dto.GameResultRequestDto;
import com.example.demo.game.dto.GameResultResponseDto;
import com.example.demo.game.entity.GameSession;

public interface GameService {
    GameResultResponseDto processGameResult(GameResultRequestDto dto);
    GameSession recordGame(String userId, int score, int playTimeSec);
}
