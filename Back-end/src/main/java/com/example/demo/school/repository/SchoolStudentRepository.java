package com.example.demo.school.repository;

import com.example.demo.school.entity.SchoolStudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SchoolStudentRepository extends JpaRepository<SchoolStudentEntity, Long> {
    // 기존 메서드 유지 (혹시 나중에 쓰일 수 있음)
    // Optional<SchoolStudentEntity> findByStudentNumberAndSchool_SchoolName(String studentNumber, String schoolName);

    // 학번만으로 찾기
    Optional<SchoolStudentEntity> findByStudentNumber(String studentNumber);

    // 또는 아래처럼 단순 존재 여부 확인용도 가능
    // boolean existsByStudentNumber(String studentNumber);


}
