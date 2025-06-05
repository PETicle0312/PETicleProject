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
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;

    @JoinColumn(name = "student_number")
    private String studentNumber;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(name = "input_count", nullable = false)
    private int inputCount;

    @Column(name = "input_time", nullable = false)
    private String inputTime; // yyyy-MM-dd HH:mm:ss 등
}
