package com.example.demo.admin.service;

import com.example.demo.admin.dto.AdminLoginRequestDto;
import com.example.demo.admin.dto.AdminLoginResponseDto;
import com.example.demo.school.entity.SchoolEntity;

import java.util.List;

public interface AdminService {
    AdminLoginResponseDto login(AdminLoginRequestDto dto);
    List<SchoolEntity> getSchoolsByAdminRegion(Long adminId);
}
