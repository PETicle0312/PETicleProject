package com.example.demo.device.service;

import com.example.demo.common.sse.LivesSseManager;     
import com.example.demo.user.dto.LivesDto; 
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

    private final LivesSseManager sse;

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

        if (dto.getInputCount() <= 0) {
            return "정상 PET이 아니므로 저장하지 않음";
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
//-----------------------------실시간 목숨반영 수정 로직---------------------------        
    // 목숨 증가
    int currentLives = user.getTotalLives();
    user.setTotalLives(currentLives + dto.getInputCount());
    userRepository.save(user);

    // 누적 투입량 합계 (SUM이 null일 수 있어 0 보정)
    Integer total = petInputLogRepository.getTotalCountByUserId(user.getUserId());
    int totalRecycleCount = (total != null) ? total : 0;

    // ✅ SSE로 실시간 푸시 (userId는 String 기준)
    sse.publishLives(
    user.getUserId(),
    new LivesDto(
        user.getUserId(),
        user.getTotalLives(),
        totalRecycleCount,
        LocalDateTime.now(),
        dto.getInputCount() )
         // LivesDto(userId, totalLives, totalRecycleCount)
);
//-----------------------------------------------------------------------------------
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