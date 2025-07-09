package com.example.demo.admin.service;

import com.example.demo.admin.dto.AdminLoginRequestDto;

public interface AdminService {
    boolean login(AdminLoginRequestDto dto);
}
