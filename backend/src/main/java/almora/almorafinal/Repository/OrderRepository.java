package almora.almorafinal.Repository;

import almora.almorafinal.Entities.Order;
import almora.almorafinal.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order>  findByUser(User user) ;
}
