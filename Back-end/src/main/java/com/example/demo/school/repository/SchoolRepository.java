package com.example.demo.school.repository;

import com.example.demo.school.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {
    // 학교 이름으로 School 엔티티 찾기
    School findBySchoolName(String schoolName);
}
