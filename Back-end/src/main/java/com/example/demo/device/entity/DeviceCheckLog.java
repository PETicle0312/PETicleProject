package com.example.demo.device.entity;

import java.time.LocalDateTime;

import com.example.demo.admin.entity.AdminEntity;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "device_check_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceCheckLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "check_log_id")
    private Long checkLogId;

    @Column(name = "action_type", nullable = false)
    private String actionType;  // 예: "정기 점검", "수거 완료", "수리"

    @Column(name = "log_time", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime logTime;     // yyyy-MM-dd HH:mm:ss

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminEntity adminId;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device deviceId;

}
