package almora.almorafinal.Services;

import almora.almorafinal.Entities.Cart;
import almora.almorafinal.Entities.Order;
import almora.almorafinal.Entities.OrderItem;
import almora.almorafinal.Entities.User;
import almora.almorafinal.Repository.CartRepository;
import almora.almorafinal.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final CartRepository cartRepo;
    private final EmailService emailService;



    public OrderService(OrderRepository orderRepo, CartRepository cartRepo, EmailService emailService) {
        this.orderRepo = orderRepo;
        this.cartRepo = cartRepo;
        this.emailService = emailService;
    }

    public Order placeOrder(User user, String paymentIntentId, String shippingAddress) {
        Cart cart = cartRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found for user"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty, cannot place order");
        }

        // Convert CartItems to OrderItems
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(item -> OrderItem.builder()
                        .product(item.getProduct())
                        .quantity(item.getQuantity())
                        .price(item.getProduct().getPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        // Calculate total
        double total = orderItems.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();

        // Create new Order
        Order order = Order.builder()
                .user(user)
                .items(orderItems)
                .totalAmount(total)
                .status(paymentIntentId != null ? Order.Status.PAID : Order.Status.PENDING)
                .shippingAddress(shippingAddress != null ? shippingAddress : "N/A")
                .paymentIntentId(paymentIntentId)
                .createdAt(LocalDateTime.now())
                .build();


        double total1 = order.getItems() != null
                ? order.getItems().stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum()
                : 0.0;


        order.setTotalPrice(total1);  // optional, if you use both
        order.setTotalAmount(total1); // optional, for payment intent total
        // Save Order

        Order savedOrder = orderRepo.save(order);

        // Send confirmation email if user email exists
        if (user.getEmail() != null) {
            emailService.sendOrderConfirmation(
                    user.getEmail(),
                    String.valueOf(savedOrder.getId()),
                    savedOrder.getTotalAmount()
            );
        }

        // Clear the user's cart
        cart.getItems().clear();
        cart.setTotal(0.0);
        cartRepo.save(cart);

        return savedOrder;
    }

    public List<Order> getOrderHistory(User user) {
        return orderRepo.findByUser(user);
    }

    public Order getOrderById(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateStatus(Long orderId, Order.Status status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepo.save(order);
    }

    public Order saveOrder(Order order) {
        return orderRepo.save(order);
    }
}
