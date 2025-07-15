package com.example.demo.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "schools")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchoolEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "school_id")
    private Long id;


    @Column(name = "school_name", nullable = false)
    private String schoolName;

    @Column(name = "region")
    private String region;

    @Column(name = "address") 
    private String address;
}
