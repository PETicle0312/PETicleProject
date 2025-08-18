package com.example.demo.device.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor   
public class DeviceCheckLogDto {
    private Long adminId;
    private String admName;
    private String actionType;
    private LocalDateTime logTime;
}