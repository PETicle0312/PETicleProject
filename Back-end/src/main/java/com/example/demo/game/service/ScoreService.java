package com.example.demo.game.service;

import com.example.demo.game.entity.ScoreLog;
import com.example.demo.game.repository.ScoreLogRepository;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreLogRepository scoreLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addScore(String userId, int delta, String source, String detail) {
        // User 조회 (없으면 새로 생성)
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.save(User.builder()
                        .userId(userId).score(0).build()));

        // 로그 기록
        scoreLogRepository.save(ScoreLog.builder()
                .user(user)
                .source(source)
                .detail(detail)
                .scoreGiven(delta)
                .build());

        // 누적 점수 업데이트
        user.setScore(user.getScore() + delta);
    }
}
