package com.example.demo.user.service;

import com.example.demo.repository.GameSessionRepository;
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
    private final GameSessionRepository gameSessionRepository; 

    @Override
    public String registerUser(UserRegisterDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            return "이미 존재하는 아이디입니다.";
        }

        User user = new User(dto.getUsername(), dto.getPassword(), dto.getPhone());
        userRepository.save(user);
        return "회원가입 성공";
    }

    @Override
    public LoginResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

        if (!user.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return new LoginResponseDto(user.getId(), user.getUsername(), user.getTotalLives());
    }

    @Override
    public List<UserRankingDto> getUserRanking() {
        return userRepository.findAll().stream()
                .map(user -> new UserRankingDto(user.getUsername(), user.getTotalLives()))
                .collect(Collectors.toList());
    }

    @Override
    public void startGameSession(StartSessionDto dto) {
        // 추후 필요시 GameSession Entity에 저장
        System.out.println("세션 시작: " + dto.getSessionId());
    }
}
