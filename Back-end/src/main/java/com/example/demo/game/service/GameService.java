package com.example.demo.game.service;

import com.example.demo.game.dto.GameResultRequestDto;
import com.example.demo.game.dto.GameResultResponseDto;

public interface GameService {
    GameResultResponseDto processGameResult(GameResultRequestDto dto);
}

