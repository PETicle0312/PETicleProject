package com.example.demo.school.repository;

import com.example.demo.school.entity.SchoolStudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SchoolStudentRepository extends JpaRepository<SchoolStudentEntity, Long> {
    Optional<SchoolStudentEntity> findByStudentNumberAndSchool_SchoolName(String studentNumber, String schoolName);
}
