package com.example.demo.openapi.service;

import com.example.demo.openapi.dto.SchoolSimpleDto;
import com.example.demo.school.entity.SchoolEntity;
import com.example.demo.school.repository.SchoolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OpenSchoolService {
    private final SchoolRepository repo;

    // 페이징 검색: query/region/adminRegion 중 들어온 걸로 분기
    public Page<SchoolSimpleDto> search(String query, String region, String adminRegion, Pageable pageable) {
        Page<SchoolEntity> page;

        boolean hasQuery = query != null && !query.isBlank();
        boolean hasRegion = region != null && !region.isBlank();
        boolean hasAdmin = adminRegion != null && !adminRegion.isBlank();

        if (hasRegion && hasQuery) {
            page = repo.findByRegionAndSchoolNameContainingIgnoreCase(region, query, pageable);
        } else if (hasAdmin && hasQuery) {
            page = repo.findByAdminRegionAndSchoolNameContainingIgnoreCase(adminRegion, query, pageable);
        } else if (hasRegion) {
            page = repo.findByRegion(region, pageable);
        } else if (hasAdmin) {
            page = repo.findByAdminRegion(adminRegion, pageable);
        } else if (hasQuery) {
            page = repo.findBySchoolNameContainingIgnoreCase(query, pageable);
        } else {
            page = repo.findAll(pageable);
        }

        return page.map(s -> new SchoolSimpleDto(s.getId(), s.getSchoolName()));
    }

    // 전체(List)로 한 번에 — 상한(limit) 만큼만
    public List<SchoolSimpleDto> searchAll(String query, String region, String adminRegion, int limit) {
        Pageable first = PageRequest.of(0, limit, Sort.by("id").ascending());
        return search(query, region, adminRegion, first).getContent();
    }
}
