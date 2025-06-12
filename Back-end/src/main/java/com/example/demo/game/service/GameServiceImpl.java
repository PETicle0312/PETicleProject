package com.example.demo.game.service;

import com.example.demo.device.dto.PetInputLogDto;
import com.example.demo.device.service.PetInputLogService;
import com.example.demo.game.dto.GameResultRequestDto;
import com.example.demo.game.dto.GameResultResponseDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final UserRepository userRepository;
    private final PetInputLogService petInputLogService;

    @Override
    public GameResultResponseDto processGameResult(GameResultRequestDto dto) {
        User user = userRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        String result = dto.getClassificationResult();
        String message;

        if ("CLEAN".equalsIgnoreCase(result)) {
            // 유저 목숨 증가
            user.setTotalLives(user.getTotalLives() + 1);
            message = "정상 PET 병입니다. 목숨 +1!";

            // PET 병 수거 실적 기록
            PetInputLogDto logDto = new PetInputLogDto();
            logDto.setUserId(user.getUserId());
            logDto.setDeviceId(1L); // ⚠️ 실제 디바이스 ID 넣어야 함
            logDto.setInputCount(1);
            logDto.setInputTime(LocalDateTime.now());

            petInputLogService.saveInputLog(logDto);
        } else {
            message = "비정상 PET 병입니다. 점수/목숨 변동 없음.";
        }   

        userRepository.save(user);

        return new GameResultResponseDto(message, 0, user.getTotalLives()); // score는 제거됨
    }

}
