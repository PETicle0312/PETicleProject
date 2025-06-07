package com.example.demo.game.entity;

import com.example.demo.user.entity.User;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameSession {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;

    @Column( nullable = false)
    private int score;

    @Column(name="play_time", nullable = false)
    private String playTime; // yyyy-MM-dd HH:mm:ss 형태 추천

       // 필요시 생성자에 기본값 설정
    public void addScore(int amount) {
        this.score += amount;
    }

    @Column(nullable = false)
    private LocalDateTime createdAt;

}