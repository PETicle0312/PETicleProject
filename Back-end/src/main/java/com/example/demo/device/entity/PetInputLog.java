package com.example.demo.device.entity;

import com.example.demo.school.entity.School;
import com.example.demo.user.entity.User;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pet_input_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetInputLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String studentNumber;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(nullable = false)
    private int inputCount;

    @Column(nullable = false)
    private String inputTime; // yyyy-MM-dd HH:mm:ss 등
}
