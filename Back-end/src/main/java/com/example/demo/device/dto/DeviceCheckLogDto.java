package com.example.demo.device.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class DeviceCheckLogDto {
    private Long adminId;        // 관리자 번호
    private String admName;      // 관리자 이름
    private String actionType;   // 작업 타입 (수거/점검/수리 등)
    private LocalDateTime logTime; // 날짜

    // JPQL new 생성자용
    public DeviceCheckLogDto(Long adminId, String admName, String actionType, LocalDateTime logTime) {
        this.adminId = adminId;
        this.admName = admName;
        this.actionType = actionType;
        this.logTime = logTime;
    }
}
