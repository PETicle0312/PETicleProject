package com.example.demo.device.dto;

import java.time.LocalDateTime;

import lombok.Data;



@Data
public class PetInputLogDto {
    private String userId;
    private String studentNumber;
    private Long deviceId;
    private int inputCount;
    private LocalDateTime inputTime;
}
