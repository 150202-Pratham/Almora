package almora.almorafinal.Controller;

import almora.almorafinal.Services.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final StripeService  stripeService;

    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> request) {
        try {
            Double amount = Double.parseDouble(request.get("amount").toString());
            Map<String, Object> response = stripeService.createPaymentIntent(amount);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // 2️⃣ Verify Payment Status
    @GetMapping("/verify/{paymentIntentId}")
    public ResponseEntity<?> verifyPayment(@PathVariable String paymentIntentId) {
        try {
            PaymentIntent intent = stripeService.verifyPayment(paymentIntentId);
            return ResponseEntity.ok(Map.of(
                    "id", intent.getId(),
                    "status", intent.getStatus(),
                    "amount", intent.getAmount() / 100.0
            ));
        } catch (StripeException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

}
