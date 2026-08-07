package almora.almorafinal.Services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender ;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendOrderConfirmation(String toEmail , String orderId , double totalAmount  ){
        SimpleMailMessage message = new SimpleMailMessage() ;

        message.setTo(toEmail);
        message.setSubject("Order Confirmation- Almora Fashion Store");
        message.setText("Dear Customer,\n\nYour order with ID:" + orderId +
                   " has been successfully placed.\nTotal Amount: ₹" + totalAmount +
                "\n\nThank you for shopping with us!\n\nTeam Almora Fashion");


        mailSender.send(message) ;

    }

    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    public void sendVerificationEmail(String toEmail, String token) {
        try {
            // Generate verification link
            String verifyUrl = "http://localhost:3000/email-confirmation?token=" + token;

            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("verifyUrl", verifyUrl);

            // Render the HTML template
            String htmlContent = templateEngine.process("verify-email", context);

            // Create MimeMessage
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Verify your Almora account");
            helper.setText(htmlContent, true);

            // ✅ Embed the image from classpath
            ClassPathResource logo = new ClassPathResource("static/images/almora-logo.png");
            helper.addInline("almoraLogo", logo);

            mailSender.send(mimeMessage);
            System.out.println("✅ Verification email sent successfully to: " + toEmail);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }






}
