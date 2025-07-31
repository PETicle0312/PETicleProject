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

    private final DeviceRepository deviceRepository;

    // POST: 수거함 상태 업데이트
    @PostMapping("/{deviceId}/capacity")
    public ResponseEntity<String> updateCapacity(
            @PathVariable Long deviceId,
            @RequestBody CapacityRequest request) {

        Optional<Device> optionalDevice = deviceRepository.findById(deviceId);
        if (optionalDevice.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found");
        }

        Device device = optionalDevice.get();

        device.setCapacity((int) request.getCapacity());
        device.setLastUpdate(LocalDateTime.now());

        deviceRepository.save(device);
        return ResponseEntity.ok("Updated");
    }

    // GET: 수거 상태 조회
    @GetMapping("/{deviceId}/status")
    public ResponseEntity<DeviceStatusResponse> getStatus(@PathVariable Long deviceId) {
        return deviceRepository.findById(deviceId)
                .map(device -> {
                    double maxCapacity = 30.0;
                    double percentage = Math.min(device.getCapacity() / maxCapacity * 100.0, 100.0);
                    return ResponseEntity.ok(new DeviceStatusResponse(
                            device.getDeviceId(),
                            device.getCapacity(),
                            percentage,
                            device.getLastUpdate()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
