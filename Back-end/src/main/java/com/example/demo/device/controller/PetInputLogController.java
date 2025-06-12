package com.example.demo.device.controller;

import java.util.List;

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
        String result = petInputLogService.saveInputLog(dto);

        if ("success".equals(result)) {
            return ResponseEntity.ok("입력 로그 저장 성공");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }
    @GetMapping("/logs/{userId}")
    public ResponseEntity<List<PetInputLogDto>> getUserLogs(@PathVariable String userId) {
    List<PetInputLogDto> logs = petInputLogService.getLogsByUserId(userId);
    return ResponseEntity.ok(logs);
}
}
