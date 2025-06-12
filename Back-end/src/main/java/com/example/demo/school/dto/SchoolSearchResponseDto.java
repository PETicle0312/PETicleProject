package com.example.demo.school.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SchoolSearchResponseDto {
    private Long id;
    private String schoolName;
}
