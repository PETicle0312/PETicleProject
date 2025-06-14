package com.example.demo.school.service;

import com.example.demo.school.dto.StudentVerifyDto;
import com.example.demo.school.repository.SchoolRepository;
import com.example.demo.school.repository.SchoolStudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchoolServiceImpl implements SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolStudentRepository studentRepository;

    @Override
    public List<String> searchSchool(String keyword) {
        return schoolRepository.findBySchoolNameContaining(keyword)
                .stream()
                .map(s -> s.getSchoolName())
                .collect(Collectors.toList());
    }

    @Override
    public boolean verifyStudent(StudentVerifyDto dto) {
        return studentRepository.findByStudentNumber(dto.getStudentNumber().trim()).isPresent();
    }
}
