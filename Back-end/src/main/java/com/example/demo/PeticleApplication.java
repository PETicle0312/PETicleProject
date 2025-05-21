package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan; // ✅ 이 줄 추가!

@SpringBootApplication
@ComponentScan(basePackages = "com.example.demo")
public class PeticleApplication {
    public static void main(String[] args) {
        SpringApplication.run(PeticleApplication.class, args);
    }
}

