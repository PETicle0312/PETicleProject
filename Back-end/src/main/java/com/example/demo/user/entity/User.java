package com.example.demo.user.entity;

import java.time.LocalDateTime;

import com.example.demo.school.entity.SchoolEntity;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "user_id", length = 50)
    private String userId;

    @Column(name = "character_name",nullable = false)
    private String charName;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "last_played")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastPlayed;

    @Column(name = "name",nullable = false)
    private String name;

    @Column(name = "password",nullable = false)
    private String password;

    @Column(name = "phone_number",nullable = false, unique = true, length = 13)
    private String phone;

    @Column(name = "register_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registerDate;

    @Column(name = "total_lives")
    private int totalLives;

    @Column(name = "student_number")
    private String studentNumber; 

    @ManyToOne
    @JoinColumn(name = "school_id")
    private SchoolEntity school;
}
