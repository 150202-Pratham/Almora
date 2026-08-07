package almora.almorafinal.Controller;


import almora.almorafinal.Entities.User;
import almora.almorafinal.Services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public record RegisterRequest(@NotBlank String name,
                                  @Email @NotBlank String email,
                                  @NotBlank String password) {}

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            User created = userService.registerUser(req.name(), req.email(), req.password());

            return ResponseEntity.ok(Map.of(
                    "id", created.getId(),
                    "name", created.getName(),
                    "email", created.getEmail(),
                    "createdAt", created.getCreatedAt()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }


    @GetMapping("/byEmail")
    public ResponseEntity<?> getByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(u -> ResponseEntity.ok(Map.of(
                        "id", u.getId(),
                        "name", u.getName(),
                        "email", u.getEmail(),
                        "createdAt", u.getCreatedAt()
                )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUserDetails(id, updatedUser);
        return ResponseEntity.ok(user);
    }





}
