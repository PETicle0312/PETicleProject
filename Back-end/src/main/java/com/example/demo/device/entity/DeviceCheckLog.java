package com.example.demo.device.entity;

import com.example.demo.admin.entity.Admin;

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
    private Long checkLogId;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(nullable = false)
    private String actionType;  // 예: "정기 점검", "수거 완료", "문제 해결"

    @Column(nullable = false)
    private String logTime;     // yyyy-MM-dd HH:mm:ss
}
