package com.example.demo.admin.dto;

import com.example.demo.school.entity.SchoolEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLoginResponseDto {
    private String adminId;
    private String adminName;
    private String adminRegion;
    private List<SchoolEntity> schools; // 또는 SchoolResponseDto로 교체 가능
}
