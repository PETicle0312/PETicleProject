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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/open/v1")
@RequiredArgsConstructor
@Tag(name = "Open API - PET 입력")
public class OpenPetInputController {

    private final OpenPetInputService svc;

    // ✅ 하나로 통합: from 없으면 전체, 있으면 해당 시점부터 합계
    @GetMapping("/users/{userId}/total-count")
    public TotalCountDto getUserTotal(
            @PathVariable String userId,
            @RequestParam(required = false) String from // ISO-8601: yyyy-MM-dd 또는 yyyy-MM-ddTHH:mm:ss
    ) {
        if (from == null || from.isBlank()) {
            return svc.getUserTotal(userId); // 전체 총합
        }
        LocalDateTime fromDt = parseFlexible(from);
        return svc.getUserTotalFromDate(userId, fromDt); // 기준일시부터 합계
    }

    @GetMapping("/schools/{schoolId}/total-count")
    public TotalCountDto getSchoolTotal(@PathVariable Long schoolId) {
        return svc.getSchoolTotal(schoolId);
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

    @GetMapping("/schools/{schoolId}/students-ranking")
    public List<StudentsRankingDto> ranking(@PathVariable Long schoolId) {
        return svc.getStudentsRanking(schoolId);
    }

    // ---- 내부 유틸: 날짜/날짜시간 모두 허용 ----
    private LocalDateTime parseFlexible(String s) {
        try {
            return LocalDateTime.parse(s);          // yyyy-MM-ddTHH:mm:ss
        } catch (Exception ignore) {
            return LocalDate.parse(s).atStartOfDay(); // yyyy-MM-dd
        }
    }
}
