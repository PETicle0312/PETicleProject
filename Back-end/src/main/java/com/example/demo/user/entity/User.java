package com.example.demo.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String phone;
    private int totalLives = 3;

    public User(String username, String password, String phone) {
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.totalLives = 3;
    }
}
