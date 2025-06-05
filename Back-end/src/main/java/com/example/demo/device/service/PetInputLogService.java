package com.example.demo.device.service;

import com.example.demo.device.dto.PetInputLogDto;
import com.example.demo.device.entity.Device;
import com.example.demo.device.entity.PetInputLog;
import com.example.demo.device.repository.DeviceRepository;
import com.example.demo.device.repository.PetInputLogRepository;
import com.example.demo.game.entity.GameSession;
import com.example.demo.game.repository.GameSessionRepository;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetInputLogService {

    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final PetInputLogRepository petInputLogRepository;
    private final GameSessionRepository gameSessionRepository;

    public boolean saveInputLog(PetInputLogDto dto) {
         String userId = dto.getUserId(); // ✅ 그대로 사용
    User user = userRepository.findByUserId(userId).orElse(null);

        Device device = deviceRepository.findById(dto.getDeviceId()).orElse(null);

        if (user == null || device == null) return false;

        // 1. PET 입력 로그 저장
        PetInputLog log = PetInputLog.builder()
                .userId(user)
                .school(user.getSchool())
                .studentNumber(dto.getStudentNumber())
                .device(device)
                .inputCount(dto.getInputCount())
                .inputTime(dto.getInputTime())
                .build();

        return true;
    }
}