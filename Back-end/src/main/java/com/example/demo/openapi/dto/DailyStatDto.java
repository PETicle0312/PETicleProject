// src/main/java/com/example/demo/openapi/dto/DailyStatDto.java
package com.example.demo.openapi.dto;

import java.time.LocalDate;

public record DailyStatDto(LocalDate date, Long totalCount) {}
