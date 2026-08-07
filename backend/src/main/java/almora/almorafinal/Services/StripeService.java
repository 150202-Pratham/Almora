package almora.almorafinal.Services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Value;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String secretKey;
    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
        System.out.println("✅ Stripe initialized successfully with secret key");
    }
    public Map<String, Object> createPaymentIntent(Double amount) throws StripeException {
        Stripe.apiKey = secretKey;

        long amountInPaise = Math.round(amount * 100); // convert ₹ to paise

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInPaise)
                .setCurrency("inr")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        Map<String, Object> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        response.put("paymentIntentId", paymentIntent.getId());
        return response;
    }

    public PaymentIntent verifyPayment(String paymentIntentId) throws StripeException {
        Stripe.apiKey = secretKey;
        return PaymentIntent.retrieve(paymentIntentId);
    }

}
