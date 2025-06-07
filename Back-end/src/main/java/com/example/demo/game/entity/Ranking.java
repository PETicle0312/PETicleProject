package com.example.demo.game.entity;

import com.example.demo.user.entity.User;

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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;

    @Column(name = "period_start",nullable = false)
    private String periodStart;

    @Column(name = "period_end", nullable = false)
    private String periodEnd;

    @Column(name = "rank_position",nullable = false)
    private int rankPosition;

    @Column(name = "higest_score",nullable = false)
    private int highestScore;
}