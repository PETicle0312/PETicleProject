package com.example.demo.game.repository;

import com.example.demo.game.entity.ScoreLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreLogRepository extends JpaRepository<ScoreLog, Long> {
    // ex) 오늘 몇 번 호출했는지 체크
    long countByUser_UserIdAndSourceAndCreatedAtBetween(
        String userId, String source,
        java.time.LocalDateTime start, java.time.LocalDateTime end
    );
}
