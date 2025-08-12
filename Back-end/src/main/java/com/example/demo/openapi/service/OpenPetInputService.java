// src/main/java/com/example/demo/openapi/service/OpenPetInputService.java
package com.example.demo.openapi.service;

import com.example.demo.device.entity.PetInputLog;
import com.example.demo.device.repository.PetInputLogRepository;
import com.example.demo.openapi.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OpenPetInputService {

    private final PetInputLogRepository repo;

    public TotalCountDto getUserTotal(String userId) {
        Long total = toLong(repo.getTotalCountByUserId(userId));
        return new TotalCountDto(null, total);
    }

    public TotalCountDto getSchoolTotal(Long schoolId) {
        Long total = toLong(repo.getTotalCountBySchoolId(schoolId));
        return new TotalCountDto(schoolId, total);
    }

    public List<PetLogPublicDto> getUserRecentLogs(String userId, int limit) {
        return repo.findTop50ByUserId_UserIdOrderByInputTimeDesc(userId)
                   .stream()
                   .limit(limit)
                   .map(this::toPublicDto)
                   .toList();
    }

    public TotalCountDto getUserTotalFromDate(String userId, LocalDateTime from) {
        Long total = toLong(repo.getTotalCountByUserIdAndDate(userId, from));
        return new TotalCountDto(null, total);
    }

    public List<DailyStatDto> getDailyStatsBySchool(Long schoolId) {
        return repo.getDailyStatsBySchoolId(schoolId).stream()
                   .map(arr -> new DailyStatDto(toLocalDate(arr[0]), toLong(arr[1])))
                   .toList();
    }

    public List<SchoolRankingDto> getSchoolRanking(Long schoolId) {
        return repo.getSchoolRanking(schoolId).stream()
                   .map(arr -> new SchoolRankingDto(
                       (String) arr[0], (String) arr[1], toLong(arr[2])
                   ))
                   .toList();
    }

    /* helpers */
    private PetLogPublicDto toPublicDto(PetInputLog p) {
        Long schoolId = p.getSchool() != null ? p.getSchool().getId() : null;
        Long deviceId = p.getDevice() != null ? p.getDevice().getDeviceId() : null;
        return new PetLogPublicDto(p.getInputTime(), p.getInputCount(), schoolId, deviceId);
    }
    private Long toLong(Object v) {
        if (v == null) return 0L;
        if (v instanceof Integer i) return i.longValue();
        if (v instanceof Long l) return l;
        if (v instanceof Number n) return n.longValue();
        return 0L;
    }
    private LocalDate toLocalDate(Object o) {
        if (o instanceof java.time.LocalDate d) return d;
        if (o instanceof java.sql.Date d) return d.toLocalDate();
        if (o instanceof java.util.Date d) return new Date(d.getTime()).toLocalDate();
        return null;
        }
}
