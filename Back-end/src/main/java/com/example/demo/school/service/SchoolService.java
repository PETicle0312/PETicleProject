package com.example.demo.school.service;

import com.example.demo.school.dto.SchoolSearchResponseDto;
import com.example.demo.school.dto.StudentVerifyDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public interface SchoolService {
    List<SchoolSearchResponseDto> searchSchoolsFromOpenApi(String keyword, String region);
    List<String> searchSchool(String keyword);
    boolean verifyStudent(StudentVerifyDto dto);
}