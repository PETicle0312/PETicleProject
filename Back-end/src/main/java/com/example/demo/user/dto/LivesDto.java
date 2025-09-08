// src/main/java/com/example/demo/user/dto/LivesDto.java
package com.example.demo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LivesDto {
    private String userId;
    private int totalLives;
    private int totalRecycleCount;
    // 필요하면 필드 더 추가 (ex. totalCount 등)
}
