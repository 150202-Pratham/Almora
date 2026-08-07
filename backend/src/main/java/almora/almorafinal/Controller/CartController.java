package almora.almorafinal.Controller;

import almora.almorafinal.DTO.CartDTO;
import almora.almorafinal.Entities.Cart;
import almora.almorafinal.Entities.User;
import almora.almorafinal.Services.CartService;
import almora.almorafinal.Services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {


    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    // For now we use email to simulate logged-in user
    private User findUser(String email) {
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<CartDTO> viewCart(@RequestParam String email) {

        return ResponseEntity.ok(cartService.getCart(findUser(email).getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addItem(@RequestParam String email,
                                     @RequestParam Long productId,
                                     @RequestParam int quantity) {
        CartDTO updated = cartService.addItem(findUser(email).getId(), productId, quantity);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/update")
    public ResponseEntity<CartDTO> updateItem(@RequestParam String email,
                                        @RequestParam Long productId,
                                        @RequestParam int quantity) {
        CartDTO updated = cartService.updateItem(findUser(email).getId(), productId, quantity);
        return ResponseEntity.ok(updated);

    }

    @DeleteMapping("/remove")
    public ResponseEntity<CartDTO> removeItem(@RequestParam String email,
                                        @RequestParam Long productId) {
        CartDTO updated = cartService.removeItem(findUser(email).getId(), productId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam String email) {
        cartService.clearCart(findUser(email).getId());
        return ResponseEntity.noContent().build();

    }
}
