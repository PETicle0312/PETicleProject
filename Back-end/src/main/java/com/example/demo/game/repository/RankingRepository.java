package com.example.demo.game.repository;

import com.example.demo.game.entity.Ranking;
import com.example.demo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RankingRepository extends JpaRepository<Ranking, Long> {

    @Query("SELECT MAX(r.highestScore) FROM Ranking r WHERE r.userId = :user")
    Integer findHighestScoreByUserId(@Param("user")User user);
}
