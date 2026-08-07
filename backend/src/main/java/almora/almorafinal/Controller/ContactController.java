package almora.almorafinal.Controller;

import almora.almorafinal.Entities.Contact;
import almora.almorafinal.Services.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public Contact receiveContact(@RequestBody Contact contact) {
        return contactService.saveContact(contact);
    }
}
