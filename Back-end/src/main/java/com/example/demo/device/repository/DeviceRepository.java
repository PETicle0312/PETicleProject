package com.example.demo.device.repository;

import com.example.demo.device.entity.Device;
import com.example.demo.school.entity.SchoolEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
     // 학교 기준으로 디바이스 리스트 가져오기
    List<Device> findBySchool(SchoolEntity school);

    // 또는 schoolId로도 가능
    List<Device> findBySchool_Id(Long schoolId);
}
