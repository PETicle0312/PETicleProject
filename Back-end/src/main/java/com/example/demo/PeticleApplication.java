package com.example.demo;

import com.example.demo.game.service.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.example.demo")
public class PeticleApplication  {
    public static void main(String[] args) {
        SpringApplication.run(PeticleApplication.class, args);
    }
    // public void run(String... args) throws Exception {
    //     // ✅ 서버 시작 시 자동으로 유저 점수 동기화
    //     pointService.migrateScores();
    // }
}
