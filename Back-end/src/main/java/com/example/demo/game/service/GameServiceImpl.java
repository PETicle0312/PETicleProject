package com.example.demo.game.service;

import com.example.demo.device.dto.PetInputLogDto;
import com.example.demo.device.service.PetInputLogService;
import com.example.demo.game.dto.GameResultRequestDto;
import com.example.demo.game.dto.GameResultResponseDto;
import com.example.demo.game.entity.GameSession;
import com.example.demo.game.repository.GameSessionRepository;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final UserRepository userRepository;
    private final GameSessionRepository gameSessionRepository;
    private final ScoreService scoreService;

    @Override
    @Transactional
    public GameSession recordGame(String userId, int score, int playTimeSec) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        GameSession session = gameSessionRepository.save(
                GameSession.builder()
                        .user(user)
                        .score(score)
                        .playTimeSec(playTimeSec)
                        .build()
        );

        scoreService.addScore(userId, score, "game", "게임 기록");
        return session;
    }

    @Override
    public GameResultResponseDto processGameResult(GameResultRequestDto dto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'processGameResult'");
    }
}
