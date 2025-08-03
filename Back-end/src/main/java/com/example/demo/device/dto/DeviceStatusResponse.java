package com.example.demo.device.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class DeviceStatusResponse {
    private Long deviceId;
    private int capacity;
    private double percentage; // ← DB 저장 X, 계산값
    private LocalDateTime lastUpdate;
}
