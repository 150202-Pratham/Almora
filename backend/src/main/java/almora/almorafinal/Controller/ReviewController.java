package almora.almorafinal.Controller;

import almora.almorafinal.DTO.ReviewCreateRequest;
import almora.almorafinal.DTO.ReviewDTO;
import almora.almorafinal.Entities.Review;
import almora.almorafinal.Repository.ReviewRepository;
import almora.almorafinal.Services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/reviews")
@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/addReview")
    public ResponseEntity<ReviewDTO> addReview (@RequestBody ReviewCreateRequest req)
    {
        ReviewDTO dto = reviewService.addReview(req) ;

       return  ResponseEntity.status(HttpStatus.OK).body(dto) ;

    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getForProduct(@PathVariable("productId") Long productId){

        return ResponseEntity.status(HttpStatus.OK).body(reviewService.getReviewsForProduct(productId)) ;

    }

    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@PathVariable Long productId) {
        Double avg = reviewService.getAverageRating(productId);
        Long cnt = reviewService.getReviewCount(productId);
        return ResponseEntity.ok(Map.of("averageRating", avg, "reviewCount", cnt));
    }


}
