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
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long adminId;

    @Column(name = "adm_name", nullable = false)
    private String admName;

    @Column(name = "adm_phone_number", nullable = false, unique = true)
    private String admPhoneNumber;

    @Column(name = "adm_password", nullable = false)
    private String admPassword;

    @Column(name = "created_at")
    private String createdAt;  // 생성일 (yyyy-MM-dd HH:mm:ss)
}
