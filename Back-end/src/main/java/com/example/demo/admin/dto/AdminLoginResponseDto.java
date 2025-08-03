package com.example.demo.admin.dto;

import com.example.demo.school.entity.SchoolEntity;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class AdminLoginResponseDto {

    private Long adminId;
    private String adminName;
    private String adminRegion;
    private List<SchoolEntity> schools;  // ✅ 관리자 지역의 학교 리스트 포함

    @Builder
    public AdminLoginResponseDto(Long adminId, String adminName, String adminRegion, List<SchoolEntity> schools) {
        this.adminId = adminId;
        this.adminName = adminName;
        this.adminRegion = adminRegion;
        this.schools = schools;
    }
}
