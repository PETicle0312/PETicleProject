package com.example.demo.device.controller; 

import com.example.demo.admin.entity.AdminEntity;
import com.example.demo.device.entity.Device;
import com.example.demo.device.entity.DeviceCheckLog;
import com.example.demo.admin.repository.AdminRepository;
import com.example.demo.device.repository.DeviceRepository;
import com.example.demo.device.repository.DeviceCheckLogRepository;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;



@RestController
@RequestMapping("/api/device-logs")
@RequiredArgsConstructor
public class DeviceCheckLogController {

    private final DeviceCheckLogRepository logRepository; //로그 정보 DB 저장
    private final AdminRepository adminRepository; // 관리자 정보 확인용
    private final DeviceRepository deviceRepository; // 디바이스 정보 확인용

    @PostMapping
    public ResponseEntity<String> logAction(@RequestBody LogRequest request) {
        Optional<AdminEntity> admin = adminRepository.findById(request.getAdminId());
        Optional<Device> device = deviceRepository.findById(request.getDeviceId()); //관리자와 디바이스 존재 여부 확인

        if (admin.isEmpty() || device.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid adminId or deviceId"); //잘못된 ID일 경우 에러 응답
        }

        DeviceCheckLog log = DeviceCheckLog.builder() //엔티티 생성 및 저장
                .deviceId(device.get())
                .adminId(admin.get())
                .actionType(request.getActionType())
                .logTime(LocalDateTime.now())
                .build();

        logRepository.save(log);
        return ResponseEntity.ok("Logged"); // 성공 응답 반환
    }

    @Getter
    @Setter
    public static class LogRequest { //내부 DTO클래스
        private Long adminId; 
        private Long deviceId;
        private String actionType; // 수거완료, 점검, 수리
    }
}
// 관리자가 디바이스에 대해 작업 이력을 남길 때 해당 정보 DB에 저장
// 에러나 정상 응답 반환