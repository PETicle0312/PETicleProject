package com.example.demo.user.service;

import com.example.demo.user.dto.LoginRequestDto;
import com.example.demo.user.dto.RegisterRequestDto;

public interface AuthService {
    String login(LoginRequestDto dto);
    String register(RegisterRequestDto dto);
}
