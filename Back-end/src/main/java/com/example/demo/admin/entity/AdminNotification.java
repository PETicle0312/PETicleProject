package com.example.demo.admin.entity;

import com.example.demo.device.entity.Device;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(nullable = false)
    private String notificationTime; // yyyy-MM-dd HH:mm:ss 등

    private String message; // 알림 메시지 내용 (선택)
}
