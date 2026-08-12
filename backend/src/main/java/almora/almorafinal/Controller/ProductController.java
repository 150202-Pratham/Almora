package almora.almorafinal.Controller;

import almora.almorafinal.DTO.ProductDTO;
import almora.almorafinal.DTO.ProductFilterRequest;
import almora.almorafinal.Entities.Product;
import almora.almorafinal.Services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor

public class ProductController {
    private final ProductService service;

    // ---------- Add New Product ----------
    @PostMapping
    public ResponseEntity<?> addProduct(@Valid @RequestBody Product product) {

        return ResponseEntity.ok(service.addProduct(product));
    }

    // ---------- Get All Products ----------
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @ModelAttribute ProductFilterRequest request,
            Pageable pageable) {

        return ResponseEntity.ok(
                service.getAllProducts(request, pageable)
        );
    }

    // ---------- Get Product by ID ----------
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProductById(id)) ;

    }
    
    //-----------Update Product -------------
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return ResponseEntity.ok(service.upDateProduct(id, updatedProduct));
    }

    // ---------- Delete Product ----------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }
}
