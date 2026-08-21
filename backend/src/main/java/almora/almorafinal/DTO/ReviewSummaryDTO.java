package almora.almorafinal.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewSummaryDTO {

    private Long productId ;
    private Double averageRating ;
    private Long reviewCount ;

}
