package com.example.demo.user.service;

import com.example.demo.user.dto.*;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface UserService {
    // 아이디 중복 확인 메서드 추가
    boolean existsByUserId(String userId);

    String registerUser(UserRegisterDto dto);

    LoginResponseDto login(LoginRequestDto dto);

    List<UserRankingDto> getUserRanking();

    void startGameSession(StartSessionDto dto);
}
