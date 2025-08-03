package com.example.demo.admin.controller;

import com.example.demo.admin.dto.AdminLoginRequestDto;
import com.example.demo.admin.dto.AdminLoginResponseDto;
import com.example.demo.admin.dto.SchoolStatusResponse;
import com.example.demo.admin.service.AdminService;
import com.example.demo.device.entity.Device;
import com.example.demo.device.repository.DeviceRepository;
import com.example.demo.school.entity.SchoolEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequestDto dto) {
        System.out.println("🔵 [요청 도착] 로그인 시도: " + dto.getAdminId() + ", " + dto.getPassword());

        AdminLoginResponseDto result = adminService.login(dto);
        if (result != null) {
            return ResponseEntity.ok(result); // 로그인 성공 시 관리자 + 학교 리스트 반환
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }


        // 🔽 로그인 이후, 관리자 지역 기반 학교 리스트 요청
    @Autowired
    private DeviceRepository deviceRepository;

    @GetMapping("/schools")
    public ResponseEntity<List<SchoolStatusResponse>> getSchoolsByRegion(@RequestParam Long adminId) {
        List<SchoolEntity> schools = adminService.getSchoolsByAdminRegion(adminId);

        List<SchoolStatusResponse> response = schools.stream().map(school -> {
            // 디바이스 리스트 조회
            List<Device> devices = deviceRepository.findBySchool(school);
            Device device = devices.isEmpty() ? null : devices.get(0); // 첫 번째 디바이스만 사용

            double loadRate = (device != null) ? device.getCapacity() : 0.0;

            return new SchoolStatusResponse(
                school.getSchoolName(),
                school.getAddress(),
                loadRate
            );
        }).toList();

        return ResponseEntity.ok(response);
    }
}