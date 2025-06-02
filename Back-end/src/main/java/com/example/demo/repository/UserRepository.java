package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // ex) findByPhoneNumber, findByName 등 추가 가능
}
