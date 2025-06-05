package com.example.demo.game.repository;

import com.example.demo.game.entity.GameSession;

import org.springframework.data.jpa.repository.JpaRepository;



public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    GameSession findTopByUserId_UserIdOrderByCreatedAtDesc(String userId);
}

