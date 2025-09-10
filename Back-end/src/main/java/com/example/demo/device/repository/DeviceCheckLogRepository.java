package com.example.demo.device.repository;

import com.example.demo.device.dto.DeviceCheckLogDto;
import com.example.demo.device.entity.DeviceCheckLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeviceCheckLogRepository extends JpaRepository<DeviceCheckLog, Long> {

    @Query("SELECT new com.example.demo.device.dto.DeviceCheckLogDto(" +
            "l.adminId.adminId, l.adminId.admName, l.actionType, l.logTime) " +
            "FROM DeviceCheckLog l " +
            "JOIN l.adminId a " +
            "JOIN l.deviceId d " +
            "WHERE d.deviceId = :deviceId " +
            "AND l.actionType = '수거' " +
            "AND FUNCTION('DATE_FORMAT', l.logTime, '%Y-%m') = :yearMonth " +
            "ORDER BY l.logTime DESC")
    List<DeviceCheckLogDto> findLogsByDeviceAndMonth(
            @Param("deviceId") Long deviceId,
            @Param("yearMonth") String yearMonth
    );

    // ✅ 관리자별 전체 알림 조회
    List<DeviceCheckLog> findByAdminId_AdminIdOrderByLogTimeDesc(Long adminId);
}
