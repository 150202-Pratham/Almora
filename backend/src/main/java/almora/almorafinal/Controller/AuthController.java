package almora.almorafinal.Controller;

import almora.almorafinal.Entities.User;
import almora.almorafinal.Services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

    public record ResetPasswordRequest(
            @Email @NotBlank String email
    ) {}

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Optional<User> userOpt = userService.findByEmail(req.email());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
        }

        User user = userOpt.get();
        boolean passwordMatch = userService.checkPassword(user, req.password());
        if (!passwordMatch) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
        }

        // Later we'll add JWT; for now return user info.
        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail()
                )
        ));
    }


    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        Optional<User> userOpt = userService.findByEmail(req.email());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email not found"));
        }

        // Stub – later we'll send a token via email
        return ResponseEntity.ok(Map.of(
                "message", "Password reset link will be sent to your email (stubbed)",
                "email", req.email()
        ));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        boolean success = userService.verifyUser(token);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token"));
    }


}
