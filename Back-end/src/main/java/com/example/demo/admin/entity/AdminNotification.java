package com.example.demo.admin.entity;

import java.time.LocalDateTime;

import com.example.demo.device.entity.Device;
import com.fasterxml.jackson.annotation.JsonFormat;

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
    @Column( name = "notification_id")
    private Long notificationId;

    @Column( name = "notification_time", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime notificationTime; // yyyy-MM-dd HH:mm:ss 등

    private String message; // 알림 메시지 내용 (선택)

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminEntity admin;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;
}
