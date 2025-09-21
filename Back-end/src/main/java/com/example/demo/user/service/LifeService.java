package com.example.demo.user.service;

import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LifeService {
    private final UserRepository userRepository;

    /** 하트 1 차감 후 남은 하트 수 반환 */
    @Transactional
    public int consumeOne(String userId) {
        int updated = userRepository.consumeOneLife(userId);
        if (updated == 0) { // 하트 0이거나 사용자 없음
            throw new IllegalStateException("NO_LIFE");
        }
        Integer left = userRepository.getLives(userId);
        if (left == null) throw new IllegalStateException("USER_NOT_FOUND");
        return left;
    }

    /** 현재 하트 수 조회 */
    @Transactional(readOnly = true)
    public int currentLives(String userId) {
        Integer left = userRepository.getLives(userId);
        if (left == null) throw new IllegalStateException("USER_NOT_FOUND");
        return left;
    }
}

