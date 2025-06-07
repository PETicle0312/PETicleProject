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
    @Column(name="student_id")
    private Long stdnId;

    @ManyToOne
    @JoinColumn(name = "school_id", nullable = false)
    private School schoolId;

    @Column(name="student_name",nullable = false)
    private String stdnName;

    @Column(name="student_phone_number",nullable = false)
    private String stdnMobile;

    @Column(name="student_number", nullable = false)
    private String stdnNum;
}