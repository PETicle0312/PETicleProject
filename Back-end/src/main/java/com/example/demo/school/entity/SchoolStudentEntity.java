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
public class SchoolStudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "student_number", nullable = false, unique = true)
    private String studentNumber;

    @Column(name = "student_phone_number", nullable = false, unique = true, length = 13)
    private String studentPhoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private SchoolEntity school;
}
