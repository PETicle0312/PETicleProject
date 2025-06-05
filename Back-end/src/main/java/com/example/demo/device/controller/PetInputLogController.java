package com.example.demo.device.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import com.example.demo.device.dto.PetInputLogDto;
import com.example.demo.device.service.PetInputLogService;

@RestController
@RequestMapping("/api/device")
@RequiredArgsConstructor
public class PetInputLogController {

    private final PetInputLogService petInputLogService;

    @PostMapping("/input")
    public ResponseEntity<String> inputPet(@RequestBody PetInputLogDto dto) {
        boolean result = petInputLogService.saveInputLog(dto);
        return result
            ? ResponseEntity.ok("입력 로그 저장 성공")
            : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유저 또는 디바이스 없음");
    }
}
