package com.example.demo.device.repository;

import com.example.demo.device.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    // 필요시 추가 메서드 정의 가능
}
