// src/main/java/com/example/demo/config/CorsConfig.java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry r) {
        r.addMapping("/api/open/**")
         .allowedOrigins("*")          // 필요시 특정 도메인으로 제한
         .allowedMethods("GET")
         .maxAge(3600);
    }
}
