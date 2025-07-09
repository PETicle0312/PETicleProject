package com.example.demo.school.controller;

import com.example.demo.school.dto.StudentVerifyDto;
import com.example.demo.school.entity.SchoolEntity;
import com.example.demo.school.repository.SchoolRepository;
import com.example.demo.school.service.SchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.demo.school.dto.SchoolSearchResponseDto;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/school")
public class SchoolController {

    private final SchoolService schoolService;
    private final SchoolRepository schoolRepository;

    // 기존 schoolRepository null 오류 고치기
    @Autowired
    public SchoolController(SchoolService schoolService, SchoolRepository schoolRepository) {
        this.schoolService = schoolService;
        this.schoolRepository = schoolRepository;
    }

    // 응답 형태 변경
    @GetMapping("/search")
    public List<Map<String, Object>> searchSchool(@RequestParam String keyword) {
        List<SchoolEntity> schools = schoolRepository.findBySchoolNameContaining(keyword);
        return schools.stream().map(school -> {
            Map<String, Object> map = new HashMap<>();
            map.put("schoolId", school.getId()); // ✅ ID 포함
            map.put("schoolName", school.getSchoolName());
            return map;
        }).collect(Collectors.toList());
    }

    // 학생 인증
    @PostMapping("/verify")
    public ResponseEntity<String> verifyStudent(@RequestBody StudentVerifyDto dto) {
        boolean verified = schoolService.verifyStudent(dto);
        if (verified) {
            return ResponseEntity.ok("학생 인증 완료");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("학생 인증 실패");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<SchoolSearchResponseDto>> searchSchools(@RequestParam String keyword) {
        List<SchoolSearchResponseDto> results = schoolService.searchSchoolsFromOpenApi(keyword);
    return ResponseEntity.ok(results);
}
}