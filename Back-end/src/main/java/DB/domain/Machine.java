package DB.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "machine")
public class Machine {
	@Id
    private String machineID;

    private String address;
    private LocalDateTime lastMainDate;

    @Enumerated(EnumType.STRING)
    private CarryingCapacity carryingCapacity;

    public enum CarryingCapacity {
        여유, 보통, 꽉참
    }
}
