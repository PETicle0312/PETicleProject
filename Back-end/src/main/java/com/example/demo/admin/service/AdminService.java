package com.example.demo.admin.service;

import com.example.demo.admin.dto.AdminInfoUpdateRequestDto;
import com.example.demo.admin.dto.AdminLoginRequestDto;
import com.example.demo.admin.dto.AdminLoginResponseDto;
import com.example.demo.school.entity.SchoolEntity;

import java.util.List;

public interface AdminService {
    AdminLoginResponseDto login(AdminLoginRequestDto dto);
    List<SchoolEntity> getSchoolsByAdminRegion(Long adminId);

    // 비밀번호 변경
    boolean changePassword(Long adminId, String currentPassword, String newPassword);

    // ✅ 관리자 정보 변경 (시그니처만!)
    void updateAdminInfo(AdminInfoUpdateRequestDto dto);
}