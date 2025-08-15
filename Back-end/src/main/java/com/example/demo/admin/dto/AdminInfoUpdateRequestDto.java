package com.example.demo.admin.dto;

public class AdminInfoUpdateRequestDto {
    private Long adminId;       // 관리자 번호
    private String region;      // 담당 지역
    private String name;        // 관리자 이름

    public AdminInfoUpdateRequestDto() {}

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
