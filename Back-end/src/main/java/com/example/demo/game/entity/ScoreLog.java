package com.example.demo.game.entity;

import com.example.demo.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "score_log", indexes = {
        @Index(name = "idx_score_log_user_date", columnList = "user_id,created_at"),
        @Index(name = "idx_score_log_source", columnList = "source")
})
public class ScoreLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 점수 수령자 (User 엔티티와 관계) */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false) // FK로 매핑
    private User user;

    /** 지급 출처: game / openapi / login / etc */
    @Column(name = "source", length = 50, nullable = false)
    private String source;

    /** 상세: 예) /users/{id}/total-count, "Unity 신기록" 등 */
    @Column(name = "detail", length = 255)
    private String detail;

    /** 지급 점수(양수) */
    @Column(name = "score_given", nullable = false)
    private Integer scoreGiven;

    /** 지급 시각 */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (scoreGiven == null) scoreGiven = 0;
        if (source == null) source = "unknown";
    }
}