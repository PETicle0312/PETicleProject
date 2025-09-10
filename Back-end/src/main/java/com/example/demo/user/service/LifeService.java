package com.example.demo.user.service;

import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LifeService {
    private final UserRepository userRepository;

    /** 하트 1 차감 후 남은 하트 수 반환 — 안전 버전 (save 기반) */
    @Transactional
    public int consumeOne(String userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("USER_NOT_FOUND"));

        if (u.getTotalLives() <= 0) {
            throw new IllegalStateException("NO_LIFE");
        }
        u.setTotalLives(u.getTotalLives() - 1);
        userRepository.save(u); // JPQL 없이 안전하게 커밋
        return u.getTotalLives();
    }

    /** 현재 하트 수 조회 — 안전 버전 (findById) */
    @Transactional(readOnly = true)
    public int currentLives(String userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("USER_NOT_FOUND"));
        return u.getTotalLives();
    }
}
