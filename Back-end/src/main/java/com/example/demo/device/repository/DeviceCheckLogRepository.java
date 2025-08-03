package com.example.demo.device.repository;

import com.example.demo.device.entity.DeviceCheckLog;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceCheckLogRepository extends JpaRepository<DeviceCheckLog, Long> {

    @Query("SELECT d.adminId.adminId, d.adminId.admName, d.logTime " +
        "FROM DeviceCheckLog d " +
        "WHERE d.deviceId.deviceId = :deviceId")
    List<Object[]> findWithAdminInfoByDeviceId(@Param("deviceId") String deviceId);


}
