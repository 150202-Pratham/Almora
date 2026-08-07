package almora.almorafinal.Controller;

import almora.almorafinal.Entities.Address;
import almora.almorafinal.Services.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private AddressService addressService ;

    public AddressController(AddressService addressService){
        this.addressService = addressService ;

    }

    // Add new address for a user
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> addAddress(@PathVariable Long userId, @Valid @RequestBody Address address) {
        try {
            Address saved = addressService.saveAddress(userId, address);
            return ResponseEntity.ok(Map.of(
                    "message", "Address saved successfully",
                    "addressId", saved.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all addresses for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddressesByUser(userId));
    }

    // Delete address by id
    @DeleteMapping("/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long addressId) {
        try {
            addressService.deleteAddress(addressId);
            return ResponseEntity.ok(Map.of("message", "Address deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}



