package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.annotation.ComponentScan; // ✅ 이 줄 추가!
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.example")
public class PeticleApplication {
    public static void main(String[] args) {
        SpringApplication.run(PeticleApplication.class, args);
    }
}
