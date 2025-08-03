package com.example.demo.device.service;

import com.example.demo.device.dto.DeviceCheckLogDto;
import com.example.demo.device.repository.DeviceCheckLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceCheckLogService {

    private final DeviceCheckLogRepository deviceCheckLogRepository;

    public List<DeviceCheckLogDto> getLogsByDeviceId(String deviceId) {
        List<Object[]> results = deviceCheckLogRepository.findWithAdminInfoByDeviceId(deviceId);

        return results.stream().map(obj -> {
            DeviceCheckLogDto dto = new DeviceCheckLogDto();
            dto.setAdminId((String) obj[0]);
            dto.setAdminName((String) obj[1]);
            dto.setLogTime((LocalDateTime) obj[2]);
            return dto;
        }).collect(Collectors.toList());
    }
}
