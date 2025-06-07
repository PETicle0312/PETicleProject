package com.example.demo.school.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

import com.example.demo.user.entity.User;

@Entity
@Table(name = "schools")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="school_id")
    private Long schoolId;

    @Column(name="school_name",nullable = false)
    private String schoolName;

    private String region;

    @OneToMany(mappedBy = "school")
    private List<User> users= new ArrayList<>();
}