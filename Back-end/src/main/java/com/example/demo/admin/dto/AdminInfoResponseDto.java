package com.example.demo.admin.dto;

public class AdminInfoResponseDto {
    private Long adminId;
    private String region;
    private String name;

    public AdminInfoResponseDto(Long adminId, String region, String name) {
        this.adminId = adminId;
        this.region = region;
        this.name = name;
    }

    public Long getAdminId() {
        return adminId;
    }

    public String getRegion() {
        return region;
    }

    public String getName() {
        return name;
    }
}
