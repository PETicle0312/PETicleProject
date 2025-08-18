package com.example.demo.device.service;

import com.example.demo.device.dto.DeviceCheckLogDto;
import com.example.demo.device.repository.DeviceCheckLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceCheckLogService {

    private final DeviceCheckLogRepository deviceCheckLogRepository;

    // 월별 조회: deviceId = 기기 PK, yearMonth = "2025-08" 형식
    public List<DeviceCheckLogDto> getLogsByDeviceAndMonth(Long deviceId, String yearMonth) {
        return deviceCheckLogRepository.findLogsByDeviceAndMonth(deviceId, yearMonth);
    }
}
