package com.example.demo.user.service;

import com.example.demo.user.dto.*;
import com.example.demo.user.entity.User;
import com.example.demo.school.entity.SchoolEntity;
import com.example.demo.school.repository.SchoolRepository;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;

    // existsByUserId 메서드 구현
    @Override
    public boolean existsByUserId(String userId) {
        return userRepository.existsByUserId(userId);
    }

    @Override
    public String registerUser(UserRegisterDto dto) {
        // 비밀번호 확인
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return "비밀번호가 일치하지 않습니다.";
        }

        // 아이디 중복 확인
        if (userRepository.existsByUserId(dto.getUserId())) {
            return "중복된 아이디입니다.";
        }

        // 학교 ID로 SchoolEntity 조회
        SchoolEntity school = schoolRepository.findById(Long.parseLong(dto.getSchoolId()))
                .orElseThrow(() -> new IllegalArgumentException("해당 학교가 존재하지 않습니다."));

        // User 객체 생성 및 저장
        User user = new User();
        user.setUserId(dto.getUserId());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        user.setName(dto.getName());
        user.setSchool(school); // 외래키 연결
        user.setTotalLives(3); // 기본값 설정
        user.setStudentNumber(dto.getStudentNumber()); // user 엔티티에 있어야 함

        userRepository.save(user);
        return "회원가입 성공";
    }

    // 이하 생략
    @Override
    public LoginResponseDto login(LoginRequestDto dto) {
        return null;
    }

    @Override
    public List<UserRankingDto> getUserRanking() {
        return null;
    }

    @Override
    public void startGameSession(StartSessionDto dto) {
    }
}
