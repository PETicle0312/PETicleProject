// src/main/java/com/example/demo/openapi/dto/PetLogPublicDto.java
package com.example.demo.openapi.dto;

import java.time.LocalDateTime;

public record PetLogPublicDto(
    LocalDateTime inputTime,
    Integer inputCount,
    Long schoolId,
    Long deviceId
) {}
