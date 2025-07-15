package com.example.demo.school.service;

import com.example.demo.school.dto.SchoolSearchResponseDto;
import com.example.demo.school.dto.StudentVerifyDto;
import com.example.demo.school.entity.SchoolEntity;
import com.example.demo.school.repository.SchoolRepository;
import com.example.demo.school.repository.SchoolStudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
@RequiredArgsConstructor
public class SchoolServiceImpl implements SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolStudentRepository studentRepository;
    private final RestTemplate restTemplate;
    

    @Override
    public List<String> searchSchool(String keyword) {
        return schoolRepository.findBySchoolNameContaining(keyword)
                .stream()
                .map(s -> s.getSchoolName())
                .collect(Collectors.toList());
    }

    @Override
    public List<SchoolSearchResponseDto> searchSchoolsFromOpenApi(String keyword, String region) {
        List<SchoolSearchResponseDto> result = new ArrayList<>();

        try {
            // 1. API 요청 URL 생성
            String apiUrl = "https://open.neis.go.kr/hub/schoolInfo" +
                            "?KEY=1c3792e5f07d4c64beab09cf53ef1e19" +
                            "&Type=json" +
                            "&pIndex=1" +
                            "&pSize=100";

            // 지역은 무조건 서울특별시로 고정
            apiUrl += "&LCTN_SC_NM=서울특별시";

            // 학교명 검색어 추가
            apiUrl += "&SCHUL_NM=" + keyword;

            // 지역명이 넘어오면 추가
            if (region != null && !region.isEmpty()) {
                apiUrl += "&LCTN_SC_NM=" + region;
            }

            apiUrl += "&SCHUL_NM=" + keyword;

            // 2. API 요청 및 응답
            String jsonString = restTemplate.getForObject(apiUrl, String.class);

            // 3. JSON 파싱
            JSONObject jsonObject = new JSONObject(jsonString);
            JSONArray rowArray = jsonObject
                                    .getJSONArray("schoolInfo")
                                    .getJSONObject(1)
                                    .getJSONArray("row");

            // for (int i = 0; i < rowArray.length(); i++) {
            //     JSONObject school = rowArray.getJSONObject(i);
            //     String name = school.getString("SCHUL_NM");           // 학교 이름
            //     String address = school.optString("ORG_RDNMA", "");   // 도로명 주소

            //     SchoolEntity entity;
            //     if (!schoolRepository.existsBySchoolName(name)) {
            //         entity = new SchoolEntity();
            //         entity.setSchoolName(name);
            //         entity.setAddress(address);
            //         schoolRepository.save(entity);
            //     } else {
            //         entity = schoolRepository.findBySchoolName(name).orElse(null);
            //         if (entity == null) continue;
            //     }


            for (int i = 0; i < rowArray.length(); i++) {
                JSONObject school = rowArray.getJSONObject(i);
                String kind = school.optString("SCHUL_KND_SC_NM", ""); // 고등/중등/초등 등
                if (!kind.equals("고등학교") && !kind.equals("중학교")) {
                    continue; // 초등학교 등은 제외
                }

                String name = school.getString("SCHUL_NM");
                String address = school.optString("ORG_RDNMA", "");

                SchoolEntity entity;
                if (!schoolRepository.existsBySchoolName(name)) {
                    entity = new SchoolEntity();
                    entity.setSchoolName(name);
                    entity.setAddress(address); // ✅ 주소 저장 유지됨
                    schoolRepository.save(entity);
                } else {
                    entity = schoolRepository.findBySchoolName(name).orElse(null);
                    if (entity == null) continue;
                }


                // 5. 응답 리스트에 추가
                result.add(new SchoolSearchResponseDto(entity.getId(), name, address));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }


    @Override
    public boolean verifyStudent(StudentVerifyDto dto) {
        return studentRepository.findByStudentNumber(dto.getStudentNumber().trim()).isPresent();
    }
}
