package com.example.demo.game.repository;

import com.example.demo.game.entity.ScoreLog;
import com.example.demo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ScoreLogRepository extends JpaRepository<ScoreLog, Long> {

    // 오늘 호출 횟수 체크 (범위 기반)
    long countByUser_UserIdAndSourceAndCreatedAtBetween(
            String userId,
            String source,
            LocalDateTime start,
            LocalDateTime end
    );

    // User + 날짜 범위
    List<ScoreLog> findByUserAndCreatedAtBetween(
        User user,
        LocalDateTime start,
        LocalDateTime end
    );

    // UserId + 날짜 범위
    @Query("""
           select s 
             from ScoreLog s
            where s.user.userId = :userId
              and s.createdAt between :start and :end
           """)
    List<ScoreLog> findByUserIdAndDateRange(
            String userId,
            LocalDateTime start,
            LocalDateTime end
    );

    // 총점 계산
    @Query("select coalesce(sum(s.scoreGiven), 0) " +
           "from ScoreLog s " +
           "where s.user.userId = :userId")
    Integer sumScoreByUserId(String userId);
}
