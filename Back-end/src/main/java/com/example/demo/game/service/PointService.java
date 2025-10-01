package com.example.demo.game.service;

import com.example.demo.common.dto.PointEventDto;
import com.example.demo.common.sse.LivesSseManager;
import com.example.demo.game.entity.ScoreLog;
import com.example.demo.game.repository.ScoreLogRepository;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointService {

    private final ScoreLogRepository scoreLogRepository;
    private final UserRepository userRepository;
    private final LivesSseManager livesSseManager; 
    

    /**
     * Open API 호출 시 포인트 지급 로직
     */
    @Transactional
    public int addPointForApiCall(String userId, String uri) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        // User 엔티티 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // 오늘 호출한 로그 확인
        List<ScoreLog> todayLogs = scoreLogRepository.findByUserAndCreatedAtBetween(user, start, end);
        if (todayLogs.size() >= 3) {
            return 0; // 이미 3회 다 사용했으면 포인트 지급 안 함
        }

        // 호출 횟수에 따른 점수
        int points = switch (todayLogs.size()) {
            case 0 -> 100; // 1회차
            case 1 -> 130; // 2회차
            case 2 -> 150; // 3회차
            default -> 0;
        };

        // ScoreLog 저장 (히스토리 남김)
        ScoreLog log = ScoreLog.builder()
                .user(user)
                .source("OPEN_API:" + uri)
                .scoreGiven(points)
                .build();
        scoreLogRepository.save(log);

        // ✅ User.score 총점 DB에 누적
        int updated = userRepository.addScore(userId, points);
        if (updated == 0) {
            throw new IllegalStateException("Score update failed for uid=" + userId);
        }

        // ✅ 포인트 지급 후 SSE 알림 전송
        livesSseManager.publishPoints(userId, new PointEventDto(points, user.getScore()));

        return points; // ✅ 이번에 지급된 포인트 반환
    }
    public void migrateScores() {
    int updated = userRepository.syncUserScores();
    System.out.println("✅ User.score 동기화 완료. 업데이트된 유저 수 = " + updated);
}
}
