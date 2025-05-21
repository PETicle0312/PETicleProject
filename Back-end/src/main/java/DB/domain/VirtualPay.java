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
@Table(name = "virtualpay")
public class VirtualPay {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentID;

    @ManyToOne
    @JoinColumn(name = "userID")
    private User user;

    private Integer pointUsed;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private LocalDateTime paymentDate;

    public enum TransactionType {
        결제, 인출, 충전
    }
}
