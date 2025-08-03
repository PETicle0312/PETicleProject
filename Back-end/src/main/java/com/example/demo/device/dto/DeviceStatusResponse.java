package com.example.demo.device.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class DeviceStatusResponse {
    private Long deviceId;
    private double capacity;
    private LocalDateTime lastUpdate;
}
