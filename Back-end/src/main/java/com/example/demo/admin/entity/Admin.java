package com.example.demo.admin.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    @Column(nullable = false)
    private String admName;

    @Column(nullable = false, unique = true)
    private String admPhoneNumber;

    @Column(nullable = false)
    private String admPassword;

    @Column(name = "created_at")
    private String createdAt;  // 생성일 (yyyy-MM-dd HH:mm:ss)
}
