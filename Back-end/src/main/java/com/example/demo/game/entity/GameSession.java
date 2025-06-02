package com.example.demo.game.entity;

import com.example.demo.user.entity.User;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "GameSessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private String playTime; // yyyy-MM-dd HH:mm:ss 형태 추천
}