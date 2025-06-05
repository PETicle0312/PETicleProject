package com.example.demo.device.repository;

import com.example.demo.device.entity.PetInputLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetInputLogRepository extends JpaRepository<PetInputLog, Long> {
}
