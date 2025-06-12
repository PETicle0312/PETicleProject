package com.example.demo.device.service;

import com.example.demo.device.dto.PetInputLogDto;
import com.example.demo.device.entity.Device;
import com.example.demo.device.entity.PetInputLog;
import com.example.demo.device.repository.DeviceRepository;
import com.example.demo.device.repository.PetInputLogRepository;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetInputLogService {

    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final PetInputLogRepository petInputLogRepository;

    public String saveInputLog(PetInputLogDto dto) {
        String userId = dto.getUserId();
        User user = userRepository.findByStudentNumber(dto.getStudentNumber()).orElse(null);
        if (user == null) {
            return "존재하지 않는 학번입니다";
        }

        Device device = deviceRepository.findById(dto.getDeviceId()).orElse(null);
        if (device == null) {
            return "등록되지 않은 디바이스입니다";
        }

        // 로그 객체 생성
        PetInputLog log = PetInputLog.builder()
                .userId(user)
                .school(user.getSchool())
                .device(device)
                .inputCount(dto.getInputCount())
                .inputTime(dto.getInputTime() != null ? dto.getInputTime() : LocalDateTime.now())
                .build();

        petInputLogRepository.save(log);
        return "success";
    }

    public List<PetInputLogDto> getLogsByUserId(String userId) {
        // 쿼리 시작 시간 기록
        long start = System.currentTimeMillis();

        // userId가 User 객체일 경우는 아래처럼 언더스코어(_) 사용
        List<PetInputLog> logs = petInputLogRepository.findTop50ByUserId_UserIdOrderByInputTimeDesc(userId);

        // 쿼리 끝 시간 기록
        long end = System.currentTimeMillis();
        System.out.println("⏱ 로그 조회 쿼리 시간: " + (end - start) + "ms");

        // 로그 -> DTO 변환
        return logs.stream().map(log -> {
            PetInputLogDto dto = new PetInputLogDto();
            dto.setUserId(log.getUserId().getUserId());
            dto.setDeviceId(log.getDevice().getDeviceId());
            dto.setInputCount(log.getInputCount());
            dto.setInputTime(log.getInputTime());
            return dto;
        }).collect(Collectors.toList());
    }
}
// public List<PetInputLogDto> getLogsByUserId(String userId) {
// long start = System.currentTimeMillis();

// List<PetInputLog> logs = petInputLogRepository.findByUserId(userId);

// long end = System.currentTimeMillis();
// System.out.println("⏱ 쿼리 시간(ms): " + (end - start));

// // DTO로 변환
// return logs.stream()
// .map(log -> new PetInputLogDto(log)) // 예시
// .collect(Collectors.toList());
// }