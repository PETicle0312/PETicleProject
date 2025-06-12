package com.example.demo.user.repository;

import com.example.demo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    // 로그인: userId로 조회
    Optional<User> findByUserId(String userId);


    // 아이디 중복 확인
    boolean existsByUserId(String userId);


    //디바이스에서 학번으로 사용자 조회
    Optional<User> findByStudentNumber(String studentNumber);
    User findByUserIdAndPassword(String userId, String password);

}
