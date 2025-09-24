// src/main/java/com/example/demo/user/dto/LivesDto.java
package com.example.demo.user.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LivesDto {
    private String userId;
    private int totalLives;
    private int totalRecycleCount;
    private LocalDateTime inputTime;
    private int inputCount;
}
