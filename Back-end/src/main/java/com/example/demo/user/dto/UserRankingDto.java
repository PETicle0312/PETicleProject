package com.example.demo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRankingDto {
    private String name;
    private int totalLives;
}
