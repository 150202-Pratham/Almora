package almora.almorafinal.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productBrand;
    private String productImage;
    private Double price;
    private Integer quantity;
    private Double subtotal;
}
