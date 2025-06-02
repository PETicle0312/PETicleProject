package com.example.demo.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "school_students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long schoolStudentId;

    @ManyToOne
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String studentNumber;
}