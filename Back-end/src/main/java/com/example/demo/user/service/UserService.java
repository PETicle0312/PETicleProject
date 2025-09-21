package com.example.demo.user.service;

import com.example.demo.user.dto.*;
import java.util.List;

public interface UserService {
    boolean existsByUserId(String userId);
    String registerUser(UserRegisterDto dto);
    LoginResponseDto login(LoginRequestDto dto);
    List<UserRankingDto> getUserRanking();
    void startGameSession(StartSessionDto dto);
    boolean checkUserIdDuplicate(String userId);
}