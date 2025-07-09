package com.example.demo.admin.service;

import com.example.demo.admin.dto.AdminLoginRequestDto;
import com.example.demo.admin.entity.AdminEntity;
import com.example.demo.admin.repository.AdminRepository;
import org.springframework.stereotype.Service;


@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

/* 
    @Override
    public boolean login(AdminLoginRequestDto dto) {
        Optional<AdminEntity> admin = adminRepository.findByAdminIdAndAdmPassword(
            dto.getAdminId(), dto.getPassword()
        );
        return admin.isPresent();
    }
*/


    @Override
    public boolean login(AdminLoginRequestDto dto) {
        System.out.println("🟡 입력 adminId: " + dto.getAdminId());
        System.out.println("🟡 입력 password: " + dto.getPassword());

        AdminEntity admin = adminRepository.findByAdminId(dto.getAdminId());

        if (admin == null) {
            System.out.println("❌ 관리자 없음!");
            return false;
        }

        System.out.println("✅ 관리자 찾음: " + admin.getAdmName());
        System.out.println("✅ DB 비밀번호: " + admin.getAdmPassword());

        if (admin.getAdmPassword().equals(dto.getPassword())) {
            System.out.println("🎉 로그인 성공");
            return true;
        } else {
            System.out.println("❌ 비밀번호 불일치");
            return false;
        }
    }


}
