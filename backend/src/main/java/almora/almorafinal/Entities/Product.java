package almora.almorafinal.Entities;

import almora.almorafinal.DTO.ReviewDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name; // e.g. "Men's Formal Shirt"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category; // MEN or WOMEN

    @NotBlank
    private String subCategory; // e.g. "Shirt", "Jeans", "Dress"

    private String brand;

    @ElementCollection
    private List<String> sizes; // ["S", "M", "L", "XL"]

    private String color;

    @NotNull
    private Double price;

    private Integer stock; // quantity available

    @Column(length = 2000)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> imageUrls; // ["url1", "url2", ...]

    private Boolean active = true;

    public enum Category {
        MEN,
        WOMEN
    }

    private Double averageRating;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Review> reviews;
}
