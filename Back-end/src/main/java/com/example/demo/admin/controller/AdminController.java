package com.example.demo.admin.controller;

import com.example.demo.admin.dto.AdminInfoUpdateRequestDto;
import com.example.demo.admin.dto.AdminLoginRequestDto;
import com.example.demo.admin.dto.AdminLoginResponseDto;
import com.example.demo.admin.dto.SchoolStatusResponse;
import com.example.demo.admin.dto.PasswordChangeRequestDto; // ✅ 추가
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
// @CrossOrigin(origins = "*") // 모바일/웹 테스트용 CORS가 필요하면 주석 해제
public class AdminController {

    private final AdminService adminService;

    @Autowired
    private DeviceRepository deviceRepository;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequestDto dto) {
        System.out.println("🔵 [요청 도착] 로그인 시도: " + dto.getAdminId() + ", " + dto.getPassword());

        AdminLoginResponseDto result = adminService.login(dto);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }

    // 🔽 로그인 이후, 관리자 지역 기반 학교 리스트 요청
    @GetMapping("/schools")
    public ResponseEntity<List<SchoolStatusResponse>> getSchoolsByRegion(@RequestParam Long adminId) {
        List<SchoolEntity> schools = adminService.getSchoolsByAdminRegion(adminId);

        List<SchoolStatusResponse> response = schools.stream().map(school -> {
            List<Device> devices = deviceRepository.findBySchool(school);
            Device device = devices.isEmpty() ? null : devices.get(0);

            double loadRate = (device != null) ? device.getCapacity() : 0.0;

            return new SchoolStatusResponse(
                school.getSchoolName(),
                school.getAddress(),
                loadRate
            );
        }).toList();

        return ResponseEntity.ok(response);
    }

    // ✅ 비밀번호 변경 엔드포인트 추가
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequestDto request) {
        boolean result = adminService.changePassword(
            request.getAdminId(),
            request.getCurrentPassword(),
            request.getNewPassword()
        );

        if (result) {
            return ResponseEntity.ok("비밀번호 변경 성공");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("현재 비밀번호가 일치하지 않습니다.");
        }
    }

    @PutMapping("/api/admin/update-info")
public ResponseEntity<String> updateAdminInfo(@RequestBody AdminInfoUpdateRequestDto dto) {
    adminService.updateAdminInfo(dto);
    return ResponseEntity.ok("관리자 정보가 변경되었습니다.");
}

}
