package com.example.demo.school.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private Long schoolId;

    @Column(nullable = false)
    private String schoolName;

    private String region;

    @OneToMany(mappedBy = "school")
    private List<User> users;
}