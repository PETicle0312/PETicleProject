package com.example.demo.school.repository;

import com.example.demo.school.entity.SchoolEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolRepository extends JpaRepository<SchoolEntity, Long> {
    
    // 키워드로 이름 포함 검색 (예: "한양" → "한양고등학교" 검색)
    List<SchoolEntity> findBySchoolNameContaining(String keyword);

    // 정확한 이름으로 학교 찾기 (중복 저장 방지, ID 조회용)
    Optional<SchoolEntity> findBySchoolName(String name);

    // 중복 저장 방지용 존재 여부 확인
    boolean existsBySchoolName(String schoolName);

    // 지역 기반 학교 조회
    List<SchoolEntity> findByAdminRegion(String adminRegion);
    List<SchoolEntity> findByRegion(String region);

    // ✅ 대소문자 무시 + 페이징
    Page<SchoolEntity> findBySchoolNameContainingIgnoreCase(String keyword, Pageable pageable);

    // ✅ 지역 + 키워드 동시 (둘 다 조건)
    Page<SchoolEntity> findByRegionAndSchoolNameContainingIgnoreCase(
            String region, String keyword, Pageable pageable);

    Page<SchoolEntity> findByAdminRegionAndSchoolNameContainingIgnoreCase(
            String adminRegion, String keyword, Pageable pageable);

    // ✅ 지역만 필터 (페이징)
    Page<SchoolEntity> findByRegion(String region, Pageable pageable);
    Page<SchoolEntity> findByAdminRegion(String adminRegion, Pageable pageable);
}
