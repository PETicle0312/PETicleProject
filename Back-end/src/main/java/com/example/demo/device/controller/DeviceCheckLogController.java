package com.example.demo.device.controller; // 너의 패키지 구조에 맞게 수정해줘

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

    private final DeviceCheckLogRepository logRepository;
    private final AdminRepository adminRepository;
    private final DeviceRepository deviceRepository;

    @PostMapping
    public ResponseEntity<String> logAction(@RequestBody LogRequest request) {
        Optional<AdminEntity> admin = adminRepository.findById(request.getAdminId());
        Optional<Device> device = deviceRepository.findById(request.getDeviceId());

        if (admin.isEmpty() || device.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid adminId or deviceId");
        }

        DeviceCheckLog log = DeviceCheckLog.builder()
                .deviceId(device.get())
                .adminId(admin.get())
                .actionType(request.getActionType())
                .logTime(LocalDateTime.now())
                .build();

        logRepository.save(log);
        return ResponseEntity.ok("Logged");
    }

    @Getter
    @Setter
    public static class LogRequest {
        private Long adminId;
        private Long deviceId;
        private String actionType; // 수거완료, 점검, 수리
    }
}
