package almora.almorafinal.Controller;

import almora.almorafinal.Entities.Order;
import almora.almorafinal.Entities.User;
import almora.almorafinal.Services.OrderService;
import almora.almorafinal.Services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    private User findUser(String email) {
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }



    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> request) {
        try {
            // extract data
            String email = request.get("email").toString();
            String paymentIntentId = request.containsKey("paymentIntentId")
                    ? request.get("paymentIntentId").toString()
                    : null;
            Double totalAmount = request.containsKey("totalAmount")
                    ? Double.parseDouble(request.get("totalAmount").toString())
                    : 0.0;

            User user = findUser(email);

            // build order
            Order order = Order.builder()
                    .user(user)
                    .totalAmount(totalAmount)
                    .status(paymentIntentId != null ? Order.Status.PAID : Order.Status.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            Order savedOrder = orderService.saveOrder(order);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order placed successfully");
            response.put("orderId", savedOrder != null ? savedOrder.getId() : null);
            response.put("paymentIntentId", paymentIntentId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 📜 Get Order History
    @GetMapping("/history")
    public ResponseEntity<List<Order>> getHistory(@RequestParam String email) {
        return ResponseEntity.ok(orderService.getOrderHistory(findUser(email)));
    }

    // 🔍 Get Single Order by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // 🚚 Update Order Status (admin use)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam Order.Status status) {
        Order updated = orderService.updateStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Order status updated", "status", updated.getStatus()));
    }

}
