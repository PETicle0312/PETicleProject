package com.example.demo.device.repository;

import com.example.demo.device.entity.PetInputLog;
import com.example.demo.user.entity.User;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface PetInputLogRepository extends JpaRepository<PetInputLog, Long> {

    // 최근 50개 기록
    List<PetInputLog> findTop50ByUserId_UserIdOrderByInputTimeDesc(String userId);

    // 사용자별 총 기록 수 (엔티티 파라미터 버전)
    int countByUserId(User user);

    // 사용자 누적 투입량
    @Query("SELECT SUM(p.inputCount) FROM PetInputLog p WHERE p.userId.userId = :userId")
    Integer getTotalCountByUserId(@Param("userId") String userId);

    // 기간별 사용자 누적
    @Query("SELECT SUM(p.inputCount) FROM PetInputLog p " +
           "WHERE p.userId.userId = :userId AND p.inputTime >= :startDate")
    Integer getTotalCountByUserIdAndDate(@Param("userId") String userId,
                                         @Param("startDate") LocalDateTime startDate);

    // 학교 누적 투입량  ✅ 서비스와 메서드명 맞춤
    @Query("SELECT SUM(p.inputCount) FROM PetInputLog p WHERE p.school.id = :schoolId")
    Integer getTotalCountBySchoolId(@Param("schoolId") Long schoolId);

    // 학교 일별 통계 (JPQL + FUNCTION로 안전 처리)
    @Query("SELECT FUNCTION('DATE', p.inputTime), SUM(p.inputCount) " +
           "FROM PetInputLog p WHERE p.school.id = :schoolId " +
           "GROUP BY FUNCTION('DATE', p.inputTime) " +
           "ORDER BY FUNCTION('DATE', p.inputTime)")
    List<Object[]> getDailyStatsBySchoolId(@Param("schoolId") Long schoolId);

    // 학교 랭킹
    @Query("SELECT p.userId.userId, p.userId.name, SUM(p.inputCount) as totalCount " +
           "FROM PetInputLog p WHERE p.school.id = :schoolId " +
           "GROUP BY p.userId.userId, p.userId.name " +
           "ORDER BY totalCount DESC")
    List<Object[]> getSchoolRanking(@Param("schoolId") Long schoolId);
}