package com.example.demo.admin.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long adminId;

    @Column(name = "adm_name",nullable = false)
    private String admName;

    @Column(name = "adm_password",nullable = false)
    private String admPassword;

    @Column(name = "adm_phone_number",nullable = false, unique = true, length = 13)
    private String admPhoneNumber;

    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @Column(name = "admin_region", length = 50)
    private String adminRegion;
    
}
