 package com.example.demo.user.repository;

import com.example.demo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    // 로그인: userId로 조회
    Optional<User> findByUserId(String userId);

    // (해시 비밀번호 사용 시 미사용 권장)
    @Deprecated
    User findByUserIdAndPassword(String userId, String password);

    // 아이디 중복 확인
    boolean existsByUserId(String userId);

    // 학번으로 사용자 조회
    Optional<User> findByStudentNumber(String studentNumber);

    // ✅ 하트가 1개 이상일 때만 1 감소 (동시 클릭에도 음수 방지)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE User u SET u.totalLives = u.totalLives - 1 " +
           "WHERE u.userId = :userId AND u.totalLives > 0")
    int consumeOneLife(@Param("userId") String userId);

    // ✅ 현재 하트 수 조회
    @Query("SELECT u.totalLives FROM User u WHERE u.userId = :userId")
    Integer getLives(@Param("userId") String userId);

    // ✅ 점수 누적 (OpenAPI 호출 시 사용)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
           update User u
              set u.score = coalesce(u.score, 0) + :points
            where u.userId = :userId
           """)
    int addScore(@Param("userId") String userId, @Param("points") int points);

    // ✅ 기존 score_log 합계를 user.score에 반영 (동기화)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
           update User u
              set u.score = (
                  select coalesce(sum(s.scoreGiven), 0)
                  from ScoreLog s
                  where s.user = u
              )
           """)
    int syncUserScores();
}
