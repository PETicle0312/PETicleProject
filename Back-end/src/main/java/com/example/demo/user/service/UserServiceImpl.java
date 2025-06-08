package com.example.demo.user.service;

import com.example.demo.user.dto.*;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public String registerUser(UserRegisterDto dto) {
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return "비밀번호가 일치하지 않습니다.";
        }

        if (userRepository.existsByUserId(dto.getUserId())) {
            return "중복된 아이디입니다.";
        }

        UserEntity user = new UserEntity();
        user.setUserId(dto.getUserId());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        user.setSchoolName(dto.getSchoolName());
        user.setStudentNumber(dto.getStudentNumber());
        user.setName(dto.getName());
        user.setScore(0);  // 초기값 설정

        userRepository.save(user);
        return "회원가입 성공";
    }

    @Override
    public LoginResponseDto login(LoginRequestDto dto) {
        // 생략
        return null;
    }

    @Override
    public List<UserRankingDto> getUserRanking() {
        // 생략
        return null;
    }

    @Override
    public void startGameSession(StartSessionDto dto) {
        // 생략
    }
}
