package com.example.demo.school.controller;

import com.example.demo.school.dto.StudentVerifyDto;
import com.example.demo.school.service.SchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/school")
public class SchoolController {

    private final SchoolService schoolService;

    @Autowired
    public SchoolController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchSchool(@RequestParam String keyword) {
        return ResponseEntity.ok(schoolService.searchSchool(keyword));
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyStudent(@RequestBody StudentVerifyDto dto) {
        boolean verified = schoolService.verifyStudent(dto);
        return verified
                ? ResponseEntity.ok("학생 인증 완료")
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("학생 인증 실패");
    }
}
