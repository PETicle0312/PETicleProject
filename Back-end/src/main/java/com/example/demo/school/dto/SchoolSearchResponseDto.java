package com.example.demo.school.dto;

import lombok.Data;

@Data
public class SchoolSearchResponseDto {
    private Long schoolId;
    private String schoolName;
    private String address;

    public SchoolSearchResponseDto(Long schoolId, String name, String address) {
        this.schoolId = schoolId;
        this.schoolName = name;
        this.address = address;
    }
}


