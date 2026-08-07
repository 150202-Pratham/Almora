package almora.almorafinal.Services;

import almora.almorafinal.DTO.ReviewCreateRequest;
import almora.almorafinal.DTO.ReviewDTO;
import almora.almorafinal.Entities.Product;
import almora.almorafinal.Entities.Review;
import almora.almorafinal.Entities.User;
import almora.almorafinal.Repository.ProductRepository;
import almora.almorafinal.Repository.ReviewRepository;
import almora.almorafinal.Repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository ;
    private final UserRepository userRepository ;


    public ReviewDTO addReview(ReviewCreateRequest req){
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(()->
                    new RuntimeException("Product Not found")
                );
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(()->
                        new RuntimeException("User Not Found")) ;

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(req.getRating())
                .comment(req.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        return toDTO(saved) ;


    }

    public List<ReviewDTO> getReviewsDTO(Long productId){
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return reviewRepository.findByProduct(product)
                .stream()
                .map(r -> ReviewDTO.builder()
                        .id(r.getId())
                        .userId(r.getUser().getId())
                        .userName(r.getUser().getName())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .build())
                .collect(Collectors.toList());

    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsForProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return reviewRepository.findByProductOrderByCreatedAtDesc(product)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getAverageRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Double avg = reviewRepository.findAverageRatingByProduct(product);
        return avg == null ? 0.0 : avg;
    }
    @Transactional(readOnly = true)
    public Long getReviewCount(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Long cnt = reviewRepository.countByProduct(product);
        return cnt == null ? 0L : cnt;
    }


    private ReviewDTO toDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .userName(r.getUser().getName()) // adjust getter if different
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }





}
