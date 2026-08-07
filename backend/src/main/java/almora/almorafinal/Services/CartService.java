package almora.almorafinal.Services;

import almora.almorafinal.DTO.CartDTO;
import almora.almorafinal.DTO.CartItemDTO;
import almora.almorafinal.Entities.Cart;
import almora.almorafinal.Entities.CartItem;
import almora.almorafinal.Entities.Product;
import almora.almorafinal.Entities.User;
import almora.almorafinal.Repository.CartRepository;
import almora.almorafinal.Repository.ProductRepository;
import almora.almorafinal.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepository;


    public CartDTO toCartDTO(Cart cart) {
        cart.getItems().forEach(item -> {
            Product product = item.getProduct();
            Hibernate.initialize(product);
            Hibernate.initialize(product.getImageUrls());
        });

        return CartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .total(cart.getTotal())
                .items(cart.getItems().stream()
                        .map(item -> CartItemDTO.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .productName(item.getProduct().getName())
                                .price(item.getProduct().getPrice())
                                .quantity(item.getQuantity())
                                .subtotal(item.getSubtotal())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private CartItemDTO convertToItemDTO(CartItem item) {
        Product product = item.getProduct();
        return CartItemDTO.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productBrand(product.getBrand())
                .productImage(product.getImageUrls() != null && !product.getImageUrls().isEmpty()
                        ? product.getImageUrls().get(0)
                        : null)
                .price(product.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }

    public CartDTO getCart(Long userId) {
        User user = userRepository.findById(userId)
                        .orElseThrow(()-> new RuntimeException("User not Found") ) ;

        Cart cart =  cartRepo.findByUser(user)
                .orElseGet(() -> cartRepo.save(Cart.builder().user(user).total(0.0).build()));
        cart.recalculateTotal();
        System.out.println(cart.getItems());
        return toCartDTO(cart) ;

    }

    public CartDTO addItem(Long  userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User not Found") ) ;

        Cart cart = cartRepo.findByUser(user)
                .orElseGet(() -> Cart.builder().user(user).total(0.0).build());;

        Product product = productRepo.findById(productId)
                .orElseThrow(()-> new RuntimeException("Product not Found") ) ;



        CartItem existingItem = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst().orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setSubtotal(existingItem.getQuantity() * product.getPrice());
        } else {
            CartItem newItem = CartItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .subtotal(quantity * product.getPrice())
                    .build();
            cart.getItems().add(newItem);
        }

        cart.recalculateTotal();
        Cart savedCart = cartRepo.save(cart);
        return toCartDTO(savedCart);

    }

    public CartDTO updateItem(Long userId, Long productId, int newQuantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        boolean found = false;
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                if (newQuantity <= 0) {
                    // Remove item if quantity set to 0
                    cart.getItems().remove(item);
                } else {
                    item.setQuantity(newQuantity);
                    item.setSubtotal(newQuantity * item.getProduct().getPrice());
                }
                found = true;
                break;
            }
        }

        if (!found) throw new RuntimeException("Product not found in cart");

        cart.recalculateTotal();
        Cart savedCart = cartRepo.save(cart);
        return toCartDTO(savedCart);
    }

    public CartDTO removeItem(Long userId, Long productId) {
        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        cart.recalculateTotal();
        Cart saved = cartRepo.save(cart);
        return toCartDTO(saved);
    }


    public void clearCart(Long userId) {
        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.getItems().clear();
        cart.setTotal(0.0);
        cartRepo.save(cart);
    }
}
