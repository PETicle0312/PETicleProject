package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.game.entity.Ranking;

public interface RankingRepository extends JpaRepository<Ranking, Long> { }
