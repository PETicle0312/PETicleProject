package com.example.demo.user.service;

import com.example.demo.user.dto.*;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import com.example.demo.game.entity.GameSession;
import com.example.demo.game.repository.GameSessionRepository;
import com.example.demo.school.entity.School;
import com.example.demo.school.repository.SchoolRepository;
//import com.example.demo.user.service.UserService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
//import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final GameSessionRepository gameSessionRepository;


    @Override
    public LoginResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByUserIdAndPassword(dto.getUserId(), dto.getPassword());
        if (user == null) {
            return null;
        }

        // GameSession에서 유저의 점수 조회
        GameSession session = gameSessionRepository.findTopByUserId_UserIdOrderByCreatedAtDesc(dto.getUserId());

        int score = (session != null) ? session.getScore() : 0;

        return new LoginResponseDto(user.getUserId(), score);
    }


    @Override
    public List<UserRankingDto> getUserRanking() {
        // TODO: 유저 랭킹 조회 로직 구현
        // 일단 임시로 빈 리스트 반환하면 컴파일 통과됨
        return new ArrayList<>();
    }

    @Override
    public void startGameSession(StartSessionDto dto) {
        // TODO: 실제 게임 세션 로직 구현
        // 일단은 빈 메서드로 처리해도 컴파일 OK
    }

    @Override
    public String registerUser(UserRegisterDto dto) {
        if (userRepository.existsByUserId(dto.getUserId())) {
            return "중복된 아이디입니다.";
        }

        User user = new User();
        user.setUserId(dto.getUserId());
        user.setPassword(dto.getPassword());
        user.setMobile(dto.getMobile());
        user.setName(dto.getName());
        //user.setStudentNumber(dto.getStudentNumber());

        School school = schoolRepository.findBySchoolName(dto.getSchoolName());
        if (school == null) {
            return "존재하지 않는 학교입니다.";
        }

        user.setSchool(school);
        user.setRegisterDate(LocalDate.now().toString());
        user.setTotalLives(3);

        userRepository.save(user);
        return "회원가입 성공";
    }
}
