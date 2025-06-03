package com.example.demo.user.controller;

import com.example.demo.user.dto.UserRegisterDto;
import com.example.demo.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/registration")
    public String registerUser(@RequestBody UserRegisterDto dto) {
        return userService.registerUser(dto);
    }
}
