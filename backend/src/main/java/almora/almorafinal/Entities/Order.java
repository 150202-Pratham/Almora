package almora.almorafinal.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    private double totalAmount;

    private String shippingAddress;

    private String paymentIntentId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status;

    private LocalDateTime createdAt;
    private double totalPrice;


    public enum Status {
        PLACED,
        PENDING,
        PAID,
        CANCELLED,
        SHIPPED,
        DELIVERED
    }
}
