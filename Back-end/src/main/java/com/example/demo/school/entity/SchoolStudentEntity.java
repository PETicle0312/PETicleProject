package com.example.demo.school.entity;

import jakarta.persistence.*; // JPA 관련 모든 어노테이션
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "school_students")
@Getter
@Setter
@NoArgsConstructor
public class SchoolStudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long schoolStudentId;

    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "student_number")
    private String studentNumber;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private SchoolEntity school;
}
