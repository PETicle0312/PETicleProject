package com.example.demo.game.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.demo.user.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Ranking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ranking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ranking_id")
    private Long rankingId;

    @Column(name = "period_start",nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime periodStart;

    @Column(name = "period_end", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime periodEnd;

    @Column(name = "rank_position",nullable = false)
    private int rankPosition;

    @Column(name = "highest_score",nullable = false)
    private int highestScore;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;
}