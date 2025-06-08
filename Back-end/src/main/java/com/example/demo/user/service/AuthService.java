package com.example.demo.user.service;

import com.example.demo.user.dto.RegisterRequestDto;
import com.example.demo.user.dto.LoginRequestDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    // ✅ 회원가입
    public String register(RegisterRequestDto dto) {
        // 1. 아이디 중복 확인
        if (userRepository.existsByUserId(dto.getUserId())) {
            return "이미 사용 중인 아이디입니다.";
        }

        // 2. 비밀번호와 비밀번호 확인 일치 여부 확인
        if (!dto.getPassword().equals(dto.getPasswordConfirm())) {
            return "비밀번호가 일치하지 않습니다.";
        }

        // 3. 유저 생성 및 저장
        User user = new User();
        user.setUserId(dto.getUserId());
        user.setPassword(dto.getPassword());

        userRepository.save(user);
        return "회원가입 성공";
    }

    // ✅ 로그인
    public String login(LoginRequestDto dto) {
        // findByUserIdAndPassword는 null을 반환할 수 있으므로 null 체크 필요
        User user = userRepository.findByUserIdAndPassword(dto.getUserId(), dto.getPassword());

        if (user != null) {
            return "로그인 성공";
        } else {
            return "아이디 또는 비밀번호가 올바르지 않습니다.";
        }
    }
}
