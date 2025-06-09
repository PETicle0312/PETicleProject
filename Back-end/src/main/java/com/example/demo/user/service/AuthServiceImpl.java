package com.example.demo.user.service;

import com.example.demo.user.dto.LoginRequestDto;
import com.example.demo.user.dto.RegisterRequestDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public String register(RegisterRequestDto dto) {
        if (userRepository.existsByUserId(dto.getUserId())) {
            return "이미 사용 중인 아이디입니다.";
        }

        if (!dto.getPassword().equals(dto.getPasswordConfirm())) {
            return "비밀번호가 일치하지 않습니다.";
        }

        User user = new User();
        user.setUserId(dto.getUserId());
        user.setPassword(dto.getPassword());

        userRepository.save(user);
        return "회원가입 성공";
    }

    @Override
    public String login(LoginRequestDto dto) {
        User user = userRepository.findByUserIdAndPassword(dto.getUserId(), dto.getPassword());

        if (user != null) {
            return "로그인 성공";
        } else {
            return "아이디 또는 비밀번호가 올바르지 않습니다.";
        }
    }

}
