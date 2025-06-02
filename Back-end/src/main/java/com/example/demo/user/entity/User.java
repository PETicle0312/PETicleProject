package com.example.demo.user.entity;

import com.example.demo.school.entity.School;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    private int totalLives;

    private String characterName;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    @Column(name = "register_date")
    private String registerDate;

    @Column(name = "last_played")
    private String lastPlayed;
}