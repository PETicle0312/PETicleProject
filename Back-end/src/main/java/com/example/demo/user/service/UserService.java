package com.example.demo.user.service;

import com.example.demo.user.dto.*;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface UserService {
    String registerUser(UserRegisterDto dto);

    LoginResponseDto login(LoginRequestDto dto);

    List<UserRankingDto> getUserRanking();

    void startGameSession(StartSessionDto dto);
}
