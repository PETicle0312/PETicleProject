package com.example.demo.device.entity;

import java.time.LocalDateTime;

import com.example.demo.school.entity.SchoolEntity;
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
    private SchoolEntity school;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;

    @Column(name = "student_number", nullable = false)
    private String studentNumber;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(name = "input_count", nullable = false)
    private int inputCount;

    @Column(name = "input_time", nullable = false)
    private LocalDateTime inputTime;

}
