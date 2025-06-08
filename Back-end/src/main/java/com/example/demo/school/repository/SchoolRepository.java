package com.example.demo.school.repository;

import com.example.demo.school.entity.SchoolEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolRepository extends JpaRepository<SchoolEntity, Long> {
    List<SchoolEntity> findBySchoolNameContaining(String keyword);
}
