package com.example.demo.device.repository;

import com.example.demo.device.dto.DeviceCheckLogDto;
import com.example.demo.device.entity.DeviceCheckLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeviceCheckLogRepository extends JpaRepository<DeviceCheckLog, Long> {

    @Query("SELECT new com.example.demo.device.dto.DeviceCheckLogDto(" +
            "l.adminId.id, a.admName, l.actionType, l.logTime) " +
            "FROM DeviceCheckLog l " +
            "JOIN l.adminId a " +
            "JOIN l.deviceId d " +
            "WHERE d.id = :deviceId " +
            "AND FUNCTION('DATE_FORMAT', l.logTime, '%Y-%m') = :yearMonth " +
            "ORDER BY l.logTime DESC")
    List<DeviceCheckLogDto> findLogsByDeviceAndMonth(
            @Param("deviceId") Long deviceId,
            @Param("yearMonth") String yearMonth
    );
}
