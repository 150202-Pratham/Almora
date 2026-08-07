package almora.almorafinal.specification;

import almora.almorafinal.DTO.ProductFilterRequest;
import almora.almorafinal.Entities.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;


public class ProductSpecification {
    public static Specification<Product> filterProducts(ProductFilterRequest request) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();
            if(request.getCategory()!=null){

                predicates.add(

                        criteriaBuilder.equal(

                                root.get("category"),

                                request.getCategory()

                        )

                );

            }

            if(request.getBrand()!=null && !request.getBrand().isBlank()){

                predicates.add(

                        criteriaBuilder.equal(

                                root.get("brand"),
                                request.getBrand()
                        )
                );

            }
            if(request.getColor()!=null && !request.getColor().isBlank()){

                predicates.add(

                        criteriaBuilder.equal(

                                root.get("color"),

                                request.getColor()

                        )

                );

            }
            if(request.getMinPrice()!=null){

                predicates.add(

                        criteriaBuilder.greaterThanOrEqualTo(

                                root.get("price"),

                                request.getMinPrice()

                        )

                );

            }
            if(request.getMaxPrice() !=null){

                predicates.add(

                        criteriaBuilder.lessThanOrEqualTo(

                                root.get("price"),

                                request.getMaxPrice()

                        )

                );

            }

            if(request.getKeyword()!=null && !request.getKeyword().isBlank()){
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),

                                "%" + request.getKeyword().toLowerCase() + "%"
                        )

                );
            }


            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

}
