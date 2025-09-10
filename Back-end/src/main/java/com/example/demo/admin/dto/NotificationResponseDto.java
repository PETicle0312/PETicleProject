package com.example.demo.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseDto {
    private Long logId;       // 로그 PK
    private String adminName; // 관리자 이름
    private String actionType; 
    private LocalDateTime logTime;
    private Long deviceId;    // 디바이스 PK
    private String schoolName; // 학교이름
}
