package almora.almorafinal.DTO;

import almora.almorafinal.Entities.Product;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductFilterRequest {

    private Product.Category category ;
    private String subCategory ;
    private String brand ;
    private String color ;
    private Double minPrice ;
    private Double maxPrice ;
    private String keyword ;


}
