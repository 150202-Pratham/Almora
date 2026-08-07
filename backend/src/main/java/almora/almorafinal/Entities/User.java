package almora.almorafinal.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")

})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password; // stored hashed

    private Instant createdAt = Instant.now();

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    @JsonProperty("phone")
    private String phoneNumber;

    @Column(nullable = false)
    private boolean verified = false;
}
