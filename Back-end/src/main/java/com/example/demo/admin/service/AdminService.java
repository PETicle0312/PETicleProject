package com.example.demo.admin.service;

import com.example.demo.admin.dto.AdminInfoResponseDto;
import com.example.demo.admin.dto.AdminInfoUpdateRequestDto;
import com.example.demo.admin.dto.AdminLoginRequestDto;
import com.example.demo.admin.dto.AdminLoginResponseDto;
import com.example.demo.school.entity.SchoolEntity;

import java.util.List;
import java.util.Optional;  // ✅ 추가

public interface AdminService {
    AdminLoginResponseDto login(AdminLoginRequestDto dto);
    List<SchoolEntity> getSchoolsByAdminRegion(Long adminId);

    boolean changePassword(Long adminId, String currentPassword, String newPassword);

    void updateAdminInfo(AdminInfoUpdateRequestDto dto);

    // ✅ 관리자 정보 조회
    Optional<AdminInfoResponseDto> getAdminInfo(Long adminId);
}
