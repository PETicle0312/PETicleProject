// build.gradle에 implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0") 등 추가

// src/main/java/com/example/demo/config/OpenApiConfig.java
package com.example.demo.config;

import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.*;

@Configuration
public class OpenApiConfig {
    @Bean
    public GroupedOpenApi openApiGroup() {
        return GroupedOpenApi.builder()
            .group("open-api")
            .packagesToScan("com.example.demo.openapi")
            .addOpenApiCustomizer(o -> o.info(new Info().title("PETicle Open API").version("v1")))
            .build();
    }
}
