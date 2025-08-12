package com.example.demo.device.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class DeviceCheckLogDto {
    private String adminId;
    private String adminName;
    private String actionType;
    private LocalDateTime logTime;
}
