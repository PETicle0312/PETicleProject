package DB.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "points")
public class Point {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pointID;

    @ManyToOne
    @JoinColumn(name = "userID")
    private User user;

    private String machineID;
    private LocalDateTime earnedAt;
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private Size size;

    private Integer qty;

    public enum Size {
        small, middle, large
    }
}
