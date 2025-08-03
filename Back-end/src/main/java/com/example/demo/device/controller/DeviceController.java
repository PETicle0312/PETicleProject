package com.example.demo.device.controller;

import com.example.demo.device.dto.CapacityRequest;
import com.example.demo.device.dto.DeviceStatusResponse;
import com.example.demo.device.entity.Device;
import com.example.demo.device.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceRepository deviceRepository; //DB 에서 디바이스 정보를 불러오거나 수정할 때 사용하는 JPA레포

    // POST: 수거함 상태 업데이트
    @PostMapping("/{deviceId}/capacity")
    public ResponseEntity<String> updateCapacity(
            @PathVariable Long deviceId,
            @RequestBody CapacityRequest request) {

        Optional<Device> optionalDevice = deviceRepository.findById(deviceId);
        if (optionalDevice.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found");
        }// DB에서 해당 수거함 찾기 or 오류 응답 반환

        Device device = optionalDevice.get(); // 실제 Device객체 꺼냄

         // 센서에서 계산된 퍼센트 값으로 capacity 필드 업데이트
        device.setCapacity(request.getCapacity());
        device.setLastUpdate(LocalDateTime.now());

        deviceRepository.save(device);
        return ResponseEntity.ok("Updated");
    }

    // GET: 수거 상태 조회
    @GetMapping("/{deviceId}/status") // 클라이언트에 전달
    public ResponseEntity<DeviceStatusResponse> getStatus(@PathVariable Long deviceId) {
        return deviceRepository.findById(deviceId)
                .map(device -> ResponseEntity.ok(new DeviceStatusResponse(
                        device.getDeviceId(),
                        device.getCapacity(),     // 이미 퍼센트 값이 저장되어 있음
                        device.getLastUpdate()
                )))
                .orElse(ResponseEntity.notFound().build()); 
     }
}
    