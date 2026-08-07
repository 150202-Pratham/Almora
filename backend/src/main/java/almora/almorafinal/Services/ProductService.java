package almora.almorafinal.Services;

import almora.almorafinal.DTO.ProductDTO;
import almora.almorafinal.DTO.ProductFilterRequest;
import almora.almorafinal.Entities.Product;
import almora.almorafinal.Repository.ProductRepository;
import almora.almorafinal.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repo;
    private final ReviewService reviewService ;

    private ProductDTO toDTO(Product product) {
        Double avgRating = reviewService.getAverageRating(product.getId());
        Long reviewCount = reviewService.getReviewCount(product.getId());

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory().toString())
                .subCategory(product.getSubCategory())
                .brand(product.getBrand())
                .sizes(product.getSizes())
                .color(product.getColor())
                .price(product.getPrice())
                .stock(product.getStock())
                .description(product.getDescription())
                .imageUrls(product.getImageUrls())
                .active(product.getActive())
                .averageRating(avgRating)
                .reviewCount(reviewCount)
                .build();
    }
    public ProductDTO addProduct(Product product) {
        System.out.println(product.getImageUrls()) ;
        Product saved  = repo.save(product) ;


        return toDTO(saved);


    }

    public Page<ProductDTO> getAllProducts(ProductFilterRequest request , Pageable pageable) {
        Specification<Product> spec = ProductSpecification.filterProducts(request) ;
        return repo.findAll(spec ,pageable)
                .map(this::toDTO);

    }

    public ProductDTO getProductById(Long id) {
        Product product = repo.findById(id).
                orElseThrow(()-> new RuntimeException ("Product Not Found"));
        return toDTO(product);

    }

    public List<ProductDTO> getByCategory(Product.Category category) {
        return repo.findByCategory(category).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getByCategoryAndSubCategory(Product.Category category, String subCategory) {
        return repo.findByCategoryAndSubCategory(category, subCategory).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> search(String keyword) {
        return repo.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO upDateProduct(Long id , Product upDatedProduct){
        Product existProduct  = repo.findById(id)
                .orElseThrow(()-> new RuntimeException ("Product Not Found"));

        existProduct.setName(upDatedProduct.getName());
        existProduct.setCategory(upDatedProduct.getCategory());
        existProduct.setSubCategory(upDatedProduct.getSubCategory());
        existProduct.setBrand(upDatedProduct.getBrand());
        existProduct.setSizes(upDatedProduct.getSizes());
        existProduct.setPrice(upDatedProduct.getPrice());
        existProduct.setStock(upDatedProduct.getStock());
        existProduct.setActive(upDatedProduct.getActive());
        existProduct.setImageUrls(upDatedProduct.getImageUrls());
        existProduct.setDescription(upDatedProduct.getDescription());
        existProduct.setColor(upDatedProduct.getColor());

        repo.save(existProduct);

        return toDTO(existProduct) ;

    }
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
