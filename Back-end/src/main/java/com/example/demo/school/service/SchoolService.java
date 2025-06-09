package com.example.demo.school.service;

import com.example.demo.school.dto.StudentVerifyDto;
import com.example.demo.school.entity.SchoolStudentEntity;
import com.example.demo.school.repository.SchoolRepository;
import com.example.demo.school.repository.SchoolStudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolStudentRepository studentRepository;

    public List<String> searchSchool(String keyword) {
        return schoolRepository.findBySchoolNameContaining(keyword)
                .stream()
                .map(s -> s.getSchoolName())
                .collect(Collectors.toList());
    }

    public boolean verifyStudent(StudentVerifyDto dto) {
        return studentRepository.findByStudentNumberAndSchool_SchoolName(dto.getStudentNumber(), dto.getSchoolName())
                .map(student -> student.getStudentName().equals(dto.getStudentName()))
                .orElse(false);
    }
}
