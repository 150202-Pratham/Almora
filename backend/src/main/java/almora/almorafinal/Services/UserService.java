package almora.almorafinal.Services;

import almora.almorafinal.Entities.User;
import almora.almorafinal.Entities.VerificationToken;
import almora.almorafinal.Repository.UserRepository;
import almora.almorafinal.Repository.VerificationTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder ;
    private final EmailService emailService;
    private VerificationTokenRepository tokenRepository;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder , EmailService emailService , VerificationTokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public User registerUser(String name, String email, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        System.out.println(rawPassword) ;

        String hashed = passwordEncoder.encode(rawPassword);
        User user = new User(name, email, hashed);

        // Generate a simple verification token (in real systems, store in DB)
        String token = java.util.UUID.randomUUID().toString();

        // Send verification email
        emailService.sendVerificationEmail(email, token);

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public User updateUserDetails(Long userId, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(userId);

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (updatedUser.getName() != null && !updatedUser.getName().isEmpty())
                existingUser.setName(updatedUser.getName());

            if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty())
                existingUser.setEmail(updatedUser.getEmail());

            if (updatedUser.getPhoneNumber() != null && !updatedUser.getPhoneNumber().isEmpty())
                existingUser.setPhoneNumber(updatedUser.getPhoneNumber());

            // ✅ Secure password update
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
                existingUser.setPassword(encodedPassword);
            }

            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }




    public boolean verifyUser(String token) {
        Optional<VerificationToken> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isPresent()) {
            VerificationToken verificationToken = tokenOpt.get();

            if (verificationToken.isExpired()) {
                tokenRepository.delete(verificationToken);
                return false;
            }

            User user = verificationToken.getUser();
            user.setVerified(true);
            userRepository.save(user);
            tokenRepository.delete(verificationToken); // one-time use

            return true;
        }

        return false;
    }




}
