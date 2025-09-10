package com.example.demo.user.repository;

import com.example.demo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    // 로그인: userId로 조회
    Optional<User> findByUserId(String userId);

    // (해시 비밀번호 사용 시 미사용 권장)
    @Deprecated
    User findByUserIdAndPassword(String userId, String password);

    // 아이디 중복 확인
    boolean existsByUserId(String userId);

    // 학번으로 사용자 조회
    Optional<User> findByStudentNumber(String studentNumber);

    // ✅ 하트가 1개 이상일 때만 1 감소 (동시 클릭에도 음수 방지)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE User u SET u.totalLives = u.totalLives - 1 " +
           "WHERE u.userId = :userId AND u.totalLives > 0")
    int consumeOneLife(@Param("userId") String userId);

    // ✅ 현재 하트 수 조회
    @Query("SELECT u.totalLives FROM User u WHERE u.userId = :userId")
    Integer getLives(@Param("userId") String userId);
}
