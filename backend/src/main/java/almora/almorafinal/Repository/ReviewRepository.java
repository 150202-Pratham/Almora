package almora.almorafinal.Repository;

import almora.almorafinal.DTO.ReviewSummaryDTO;
import almora.almorafinal.Entities.Product;
import almora.almorafinal.Entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface  ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct (Product product) ;
    List<Review> findByProductOrderByCreatedAtDesc(Product product);

    @Query("select avg(r.rating) from Review r where r.product = :product")
    Double findAverageRatingByProduct(Product product);

    @Query("select count(r) from Review r where r.product = :product")
    Long countByProduct(Product product);

    @Query(
            """
        Select new almora.almorafinal.DTO.ReviewSummaryDTO(
            r.product.id ,
                AVG(r.rating) ,
                    Count(r.id)
            )
                from Review r where r.product.id IN :productIds
                    Group by r.product.id
    """
    )
    List<ReviewSummaryDTO> getReviewSummaries(@Param("productIds") List<Long> productIds) ;

}
