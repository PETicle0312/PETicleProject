package com.example.demo.user.entity;

import java.time.LocalDateTime;
import com.example.demo.school.entity.SchoolEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "user_id", length = 50)
    private String userId;

    @Column(name = "character_name", nullable = true)
    private String charName;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "last_played")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastPlayed;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone_number", nullable = false, unique = true, length = 13)
    private String phone;

    @Column(name = "register_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registerDate;

    @Column(name = "total_lives")
    private int totalLives;

    @Column(name = "student_number", nullable = false)
    private String studentNumber;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private SchoolEntity school;

    // 비밀번호를 암호화해서 저장하도록 추가
    @PrePersist
    public void encryptPassword() {
        if (this.password != null) {
            // 비밀번호 암호화 처리, 예를 들어 BCrypt 사용
            this.password = encryptPassword(this.password); // 암호화 메서드 필요
        }
    }

    // 예시로 비밀번호를 암호화하는 메서드
    private String encryptPassword(String password) {
        // 실제 암호화 로직을 추가해야 합니다.
        // 예시로 BCrypt를 사용할 수 있습니다.
        return password; // 암호화된 비밀번호로 반환해야 합니다.
    }
}
