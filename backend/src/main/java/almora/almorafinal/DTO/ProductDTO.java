package almora.almorafinal.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;
    private String name;
    private String category;
    private String subCategory;
    private String brand;
    private List<String> sizes;
    private String color;
    private Double price;
    private Integer stock;
    private String description;
    private List<String> imageUrls;
    private Boolean active;

    private Double averageRating =  0.0 ;
    private Long reviewCount = 0L;


}
