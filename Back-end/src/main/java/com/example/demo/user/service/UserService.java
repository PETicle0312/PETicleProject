package com.example.demo.user.service;

import com.example.demo.user.dto.UserRegisterDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public String registerUser(UserRegisterDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            return "이미 존재하는 아이디입니다.";
        }

        User user = new User(dto.getUsername(), dto.getPassword(), dto.getPhone());
        userRepository.save(user);
        return "회원가입 성공";
    }
}
