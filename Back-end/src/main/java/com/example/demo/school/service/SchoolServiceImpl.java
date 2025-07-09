package com.example.demo.school.service;

import com.example.demo.school.dto.SchoolSearchResponseDto;
import com.example.demo.school.dto.StudentVerifyDto;
import com.example.demo.school.repository.SchoolRepository;
import com.example.demo.school.repository.SchoolStudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    public List<SchoolSearchResponseDto> searchSchoolsFromOpenApi(String keyword) {
        return new ArrayList<>(); 
        // (1) 오픈 API 호출 (예: RestTemplate 또는 WebClient 사용)
        // (2) JSON 파싱 (필요한 학교 정보 추출)
        // (3) 이미 DB에 존재하는지 확인 → 없으면 저장
        // (4) 응답 DTO 리스트로 반환
    }

    @Override
    public boolean verifyStudent(StudentVerifyDto dto) {
        return studentRepository.findByStudentNumber(dto.getStudentNumber().trim()).isPresent();
    }
}
