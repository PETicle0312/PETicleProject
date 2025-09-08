// src/main/java/com/example/demo/common/sse/LivesSseController.java
package com.example.demo.common.sse;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sse")
public class LivesSseController {

    private final LivesSseManager sse;

    // 클라이언트: GET /api/sse/lives/{userId}
    @GetMapping(value = "/lives/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable String userId) {
        return sse.subscribe(userId);
    }
}
