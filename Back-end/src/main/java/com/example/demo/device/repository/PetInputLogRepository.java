package com.example.demo.device.repository;

import com.example.demo.device.entity.PetInputLog;
import com.example.demo.user.entity.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PetInputLogRepository extends JpaRepository<PetInputLog, Long> {
    List<PetInputLog> findTop50ByUserId_UserIdOrderByInputTimeDesc(String userId); // 조회용으로도 사용 가능
    int countByUserId(User userId);
}
