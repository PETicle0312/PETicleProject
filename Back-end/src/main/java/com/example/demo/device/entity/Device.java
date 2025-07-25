package com.example.demo.device.entity;

import java.time.LocalDateTime;

import com.example.demo.school.entity.SchoolEntity;
import com.example.demo.admin.entity.AdminEntity;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "devices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    private Long deviceId;

    @ManyToOne
    @JoinColumn(name = "school_id", nullable = false, foreignKey = @ForeignKey(name = "fk_school_id"))
    private SchoolEntity school;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false,foreignKey = @ForeignKey(name = "fk_admin_id"))
    private AdminEntity adminId;

    private int capacity;

    @Column(name = "last_update")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdate; // yyyy-MM-dd HH:mm:ss

    private Double latitude; // 위도

    private Double longitude; // 경도
}