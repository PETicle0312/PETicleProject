package com.example.demo.user.entity;

import com.example.demo.school.entity.School;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(name="user_id", length = 50)
    private String userId;

    @Column(name = "character_name")
    private String charName;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "last_played")
    private String lastPlayed;

    @Column(name = "name")
    private String name;

    @Column(name = "password")
    private String password;

    @Column(name = "phone_number")
    private String mobile;

    @Column(name = "register_date")
    private String registerDate;

    @Column(name = "total_lives")
    private int totalLives;

    @ManyToOne
    @JoinColumn(name = "school_id")  // 외래키
    private School school;


}
