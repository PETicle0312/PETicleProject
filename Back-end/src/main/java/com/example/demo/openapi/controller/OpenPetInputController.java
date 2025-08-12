// src/main/java/com/example/demo/openapi/controller/OpenPetInputController.java
package com.example.demo.openapi.controller;

import com.example.demo.openapi.dto.*;
import com.example.demo.openapi.service.OpenPetInputService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/open/v1")
@RequiredArgsConstructor
@Tag(name = "Open API - PET 입력")
public class OpenPetInputController {

    private final OpenPetInputService svc;

    @GetMapping("/users/{userId}/total-count")
    public TotalCountDto getUserTotal(@PathVariable String userId) {
        return svc.getUserTotal(userId);
    }

    @GetMapping("/schools/{schoolId}/total-count")
    public TotalCountDto getSchoolTotal(@PathVariable Long schoolId) {
        return svc.getSchoolTotal(schoolId);
    }

    @GetMapping("/users/{userId}/total-count-since")
    public TotalCountDto getUserTotalSince(@PathVariable String userId,
                                           @RequestParam String from) { // ISO-8601
        return svc.getUserTotalFromDate(userId, LocalDateTime.parse(from));
    }

    @GetMapping("/users/{userId}/recent-logs")
    public List<PetLogPublicDto> recentLogs(@PathVariable String userId,
                                            @RequestParam(defaultValue = "20")
                                            @Min(1) @Max(50) int limit) {
        return svc.getUserRecentLogs(userId, limit);
    }

    @GetMapping("/schools/{schoolId}/daily-stats")
    public List<DailyStatDto> dailyStats(@PathVariable Long schoolId) {
        return svc.getDailyStatsBySchool(schoolId);
    }

    @GetMapping("/schools/{schoolId}/ranking")
    public List<SchoolRankingDto> ranking(@PathVariable Long schoolId) {
        return svc.getSchoolRanking(schoolId);
    }
}
