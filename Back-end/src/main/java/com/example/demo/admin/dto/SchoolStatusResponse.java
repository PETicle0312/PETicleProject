// SchoolStatusResponse.java
package com.example.demo.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SchoolStatusResponse {
    private String schoolName;
    private String address;
    private double loadRate; // percentage 값
}
