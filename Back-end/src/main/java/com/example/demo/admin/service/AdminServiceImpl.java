package com.example.demo.admin.service;

import com.example.demo.admin.dto.AdminLoginRequestDto;
import com.example.demo.admin.dto.AdminLoginResponseDto;
import com.example.demo.admin.entity.AdminEntity;
import com.example.demo.admin.repository.AdminRepository;
import com.example.demo.school.entity.SchoolEntity;
import com.example.demo.school.repository.SchoolRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final SchoolRepository schoolRepository;

    public AdminServiceImpl(AdminRepository adminRepository, SchoolRepository schoolRepository) {
        this.adminRepository = adminRepository;
        this.schoolRepository = schoolRepository;
    }

@Override
public AdminLoginResponseDto login(AdminLoginRequestDto dto) {
    AdminEntity admin = adminRepository.findByAdminId(dto.getAdminId())
        .orElse(null);

    if (admin == null || !admin.getAdmPassword().equals(dto.getPassword())) {
        return null;
    }

    List<SchoolEntity> schools = schoolRepository.findByAdminRegion(admin.getAdminRegion());

    return AdminLoginResponseDto.builder()
        .adminId(admin.getAdminId())
        .adminName(admin.getAdmName())
        .adminRegion(admin.getAdminRegion())
        .schools(schools)
        .build();
}   

    @Override
    public List<SchoolEntity> getSchoolsByAdminRegion(String adminId) {
        AdminEntity admin = adminRepository.findByAdminId(adminId)
            .orElseThrow(() -> new IllegalArgumentException("❌ 해당 관리자 ID를 찾을 수 없습니다: " + adminId));

        String adminRegion = admin.getAdminRegion();

        return schoolRepository.findByAdminRegion(adminRegion);
    }
}
