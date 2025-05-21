package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hello")
public class HelloController {

    @Operation(summary = "테스트 인사 API", description = "Swagger UI 확인용 간단한 API입니다.")
    @GetMapping
    public ApiResponse<String> hello() {
        return ApiResponse.success("Hello from PETicle!");
    }
}
