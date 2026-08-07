package almora.almorafinal.Services;

import almora.almorafinal.Entities.Address;
import almora.almorafinal.Entities.User;
import almora.almorafinal.Repository.AddressRepository;
import almora.almorafinal.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public Address saveAddress(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        address.setUser(user);
        return addressRepository.save(address);
    }

    public List<Address> getAddressesByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return addressRepository.findByUser(user);
    }

    public void deleteAddress(Long addressId) {
        if (!addressRepository.existsById(addressId)) {
            throw new IllegalArgumentException("Address not found");
        }
        addressRepository.deleteById(addressId);
    }
}
