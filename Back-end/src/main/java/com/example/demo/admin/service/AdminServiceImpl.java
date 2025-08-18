package com.example.demo.admin.service;

import com.example.demo.admin.dto.AdminInfoResponseDto;
import com.example.demo.admin.dto.AdminInfoUpdateRequestDto;
import com.example.demo.admin.dto.AdminLoginRequestDto;
import com.example.demo.admin.dto.AdminLoginResponseDto;
import com.example.demo.admin.entity.AdminEntity;
import com.example.demo.admin.repository.AdminRepository;
import com.example.demo.school.entity.SchoolEntity;
import com.example.demo.school.repository.SchoolRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

        return AdminLoginResponseDto.builder()
                .adminId(admin.getAdminId())
                .adminName(admin.getAdmName())
                .adminRegion(admin.getAdminRegion())
                .build();
    }

    @Override
    public List<SchoolEntity> getSchoolsByAdminRegion(Long adminId) {
        AdminEntity admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 해당 관리자 ID를 찾을 수 없습니다: " + adminId));

        String adminRegion = admin.getAdminRegion();
        return schoolRepository.findByAdminRegion(adminRegion);
    }

    @Override
    @Transactional
    public boolean changePassword(Long adminId, String currentPassword, String newPassword) {
        AdminEntity admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new RuntimeException("❌ 해당 관리자를 찾을 수 없습니다."));

        if (!admin.getAdmPassword().equals(currentPassword)) {
            return false;
        }

        admin.setAdmPassword(newPassword);
        adminRepository.save(admin);
        return true;
    }

    @Override
    @Transactional
    public void updateAdminInfo(AdminInfoUpdateRequestDto dto) {
        AdminEntity admin = adminRepository.findByAdminId(dto.getAdminId())
                .orElseThrow(() -> new IllegalArgumentException("❌ 해당 관리자 없음: " + dto.getAdminId()));

        if (dto.getName() != null) {
            admin.setAdmName(dto.getName());
        }
        if (dto.getRegion() != null) {
            admin.setAdminRegion(dto.getRegion());
        }

        adminRepository.save(admin);
    }

    @Override
    public Optional<AdminInfoResponseDto> getAdminInfo(Long adminId) {
        return adminRepository.findByAdminId(adminId)
                .map(admin -> new AdminInfoResponseDto(
                        admin.getAdminId(),
                        admin.getAdminRegion(),
                        admin.getAdmName()
                ));
    }
}
