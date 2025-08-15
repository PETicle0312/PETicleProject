package com.example.demo.admin.service;

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

    // ✅ 비밀번호 변경
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

    // ✅ 관리자 정보 수정 (담당 지역 / 이름 등)
    @Override
    @Transactional
    public void updateAdminInfo(AdminInfoUpdateRequestDto dto) {
        AdminEntity admin = adminRepository.findByAdminId(dto.getAdminId())
                .orElseThrow(() -> new IllegalArgumentException("❌ 해당 관리자 없음: " + dto.getAdminId()));

        // 엔티티 실제 필드명에 맞춰 세팅 (admName, adminRegion 사용 중)
        if (dto.getName() != null) {
            admin.setAdmName(dto.getName());
        }
        if (dto.getRegion() != null) {
            admin.setAdminRegion(dto.getRegion());
        }
        // 만약 phone 등 다른 필드도 엔티티에 있다면 여기서 같이 세팅

        adminRepository.save(admin);
    }
}