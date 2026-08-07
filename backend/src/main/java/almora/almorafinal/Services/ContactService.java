package almora.almorafinal.Services;

import almora.almorafinal.Entities.Contact;
import almora.almorafinal.Repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private EmailService emailService; // already exists in your project

    public Contact saveContact(Contact contact) {
        Contact saved = contactRepository.save(contact);

        String subject = "New Contact Submission - " + contact.getName();
        String body = String.format(
                "New message received:\n\nName: %s\nEmail: %s\nPhone: %s\nSubject: %s\n\nMessage:\n%s",
                contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getSubject(),
                contact.getMessage()
        );

        emailService.sendEmail("prathamgarg1502@gmail.com", subject, body);
        return saved;
    }
}
