package com.example.demo.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
// 👇 전역 헤더 정의 (Swagger UI에서 Authorize 버튼으로 입력 가능)
@SecurityScheme(
        name = "x-user-id",
        type = SecuritySchemeType.APIKEY,
        paramName = "x-user-id",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {

    @Bean
    public GroupedOpenApi openApiGroup() {
        return GroupedOpenApi.builder()
                .group("open-api")
                .packagesToScan("com.example.demo.openapi")
                .addOpenApiCustomizer(o -> o.info(new Info()
                        .title("PETicle Open API")
                        .version("v1")))
                .build();
    }
}
