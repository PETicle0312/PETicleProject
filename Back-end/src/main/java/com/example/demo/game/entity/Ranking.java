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
    private Long rankingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String periodStart;

    @Column(nullable = false)
    private String periodEnd;

    @Column(nullable = false)
    private int rankPosition;

    @Column(nullable = false)
    private int highestScore;
}