package com.example.demo.game.repository;

import com.example.demo.game.entity.GameSession;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    List<GameSession> findByUser_UserIdOrderByCreatedAtDesc(String userId);
}