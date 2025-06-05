package com.example.demo.device.entity;

import com.example.demo.school.entity.School;

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
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    private int capacity;

    @Column(name = "last_update")
    private String lastUpdate;  // yyyy-MM-dd HH:mm:ss

    private Double latitude;   // 위도

    private Double longitude;  // 경도
}