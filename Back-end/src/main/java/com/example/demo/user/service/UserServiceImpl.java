package com.example.demo.user.service;

import com.example.demo.user.dto.*;
import com.example.demo.user.entity.User;
import com.example.demo.school.entity.SchoolEntity;
import com.example.demo.school.repository.SchoolRepository;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.device.repository.*;
import com.example.demo.game.repository.RankingRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final PetInputLogRepository petInputLogRepository;
    private final RankingRepository rankingRepository;

    @Override
    public boolean existsByUserId(String userId) {
        return userRepository.existsByUserId(userId);
    }

    @Override
    @Transactional
    public String registerUser(UserRegisterDto dto) {
        // 학교 ID 방어
        if (dto.getSchoolId() == null || dto.getSchoolId().trim().isEmpty()) {
            return "학교를 선택해 주세요.";
        }

        Long schoolId;
        try {
            schoolId = Long.parseLong(dto.getSchoolId());
        } catch (NumberFormatException e) {
            return "올바른 학교 ID 형식이 아닙니다.";
        }

        // 비밀번호 확인
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return "비밀번호가 일치하지 않습니다.";
        }

        // 아이디 중복 확인
        if (userRepository.existsByUserId(dto.getUserId())) {
            return "중복된 아이디입니다.";
        }

        // 학교 조회
        SchoolEntity school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new IllegalArgumentException("해당 학교가 존재하지 않습니다."));

        // User 생성 (단 하나만)
        User user = new User(
                dto.getUserId(), // userId
                dto.getCharName(), // charName
                dto.getImageUrl(), // imageUrl
                null, // lastPlayed
                dto.getName(), // name
                dto.getPassword(), // password
                dto.getPhone(), // phone
                LocalDateTime.now(), // registerDate
                3, // totalLives
                dto.getStudentNumber(), // studentNumber
                school // school (방금 조회한 학교)
, null, null
        );

        // 저장
        userRepository.save(user);
        System.out.println("✅ 회원가입 완료 → ID: " + user.getUserId());

        return "회원가입 성공";
    }

    @Override
    public LoginResponseDto login(LoginRequestDto dto) {
        // 아이디로 사용자 찾기
        User user = userRepository.findByUserId(dto.getUserId()).orElse(null);

        // 사용자가 없으면 로그인 실패
        if (user == null) {
            return new LoginResponseDto("아이디가 존재하지 않습니다.", false);
        }
        System.out.println("🔐 입력된 비밀번호: [" + dto.getPassword() + "]");
        System.out.println("🔐 DB의 비밀번호: [" + user.getPassword() + "]");
        System.out.println("✔️ 일치 여부: " + user.getPassword().equals(dto.getPassword()));
        // 비밀번호 일치 여부 확인
        if (!user.getPassword().equals(dto.getPassword())) {
            return new LoginResponseDto("비밀번호가 일치하지 않습니다.", false);
        }

        // 총 수거량 조회 (PetInputLog 기준), 점수 조회
        int recycleCount = petInputLogRepository.countByUserId(user);
        Integer highestScore = rankingRepository.findHighestScoreByUserId(user);
        if (highestScore == null)
            highestScore = 0;

        // 로그인 성공
        return new LoginResponseDto(
                "로그인 성공",
                true,
                user.getUserId(),
                user.getCharName(),
                user.getTotalLives(),
                recycleCount,
                highestScore

        );

    }

    @Override
    public List<UserRankingDto> getUserRanking() {
        return null;
    }

    @Override
    public void startGameSession(StartSessionDto dto) {
    }

    @Override
    public boolean checkUserIdDuplicate(String userId) {
        return userRepository.existsByUserId(userId);
    }

}
