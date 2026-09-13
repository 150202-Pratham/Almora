package almora.almorafinal.common.response;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class ApiResponse <T> {

    private final boolean success ;
    private final String message ;
    private final LocalDateTime timeStamp ;
    private final T data ;
}
