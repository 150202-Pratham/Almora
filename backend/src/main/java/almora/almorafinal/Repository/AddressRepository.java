package almora.almorafinal.Repository;

import almora.almorafinal.Entities.Address;
import almora.almorafinal.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser(User user) ;

}
