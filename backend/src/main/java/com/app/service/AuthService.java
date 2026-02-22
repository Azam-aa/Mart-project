package com.app.service;

import com.app.model.Role;
import com.app.model.User;
import com.app.repository.UserRepository;
import com.app.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final EmailService emailService;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final PasswordEncoder passwordEncoder;

        // Signup (create user and send OTP)
        public void signup(com.app.dto.SignupRequest request) {
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new RuntimeException("User already exists with email: " + request.getEmail());
                }

                User user = User.builder()
                                .email(request.getEmail())
                                .username(request.getUsername())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.USER)
                                .enabled(false) // Disabled until OTP verification
                                .build();

                String otp = String.format("%06d", new Random().nextInt(999999));
                user.setOtp(otp);
                user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
                userRepository.save(user);

                emailService.sendOtpEmail(request.getEmail(), otp);
        }

        // Send OTP to User (for traditional OTP-only login if needed)
        public void sendOtp(String email) {
                User user = userRepository.findByEmail(email)
                                .orElse(User.builder()
                                                .email(email)
                                                .username(email)
                                                .role(Role.USER)
                                                .enabled(false)
                                                .build());

                String otp = String.format("%06d", new Random().nextInt(999999));
                user.setOtp(otp);
                user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
                userRepository.save(user);

                emailService.sendOtpEmail(email, otp);
        }

        // Verify OTP and return JWT
        public String verifyOtp(String email, String otp) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getOtp() == null || !user.getOtp().equals(otp)) {
                        throw new RuntimeException("Invalid OTP");
                }

                if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
                        throw new RuntimeException("OTP Expired");
                }

                // Clear OTP and enable user
                user.setOtp(null);
                user.setOtpExpiry(null);
                user.setEnabled(true);
                userRepository.save(user);

                // Generate Token
                var userDetails = new com.app.security.CustomUserDetails(user);
                return jwtService.generateToken(userDetails);
        }

        // Login (Password based, returns token if OTP bypassed, else null)
        public String login(com.app.dto.LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Bypass OTP for default users and admins
                if (user.getRole() == Role.ADMIN ||
                                "admin@example.com".equals(user.getEmail()) ||
                                "user@example.com".equals(user.getEmail())) {
                        var userDetails = new com.app.security.CustomUserDetails(user);
                        return jwtService.generateToken(userDetails);
                }

                String otp = String.format("%06d", new Random().nextInt(999999));
                user.setOtp(otp);
                user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
                userRepository.save(user);

                emailService.sendOtpEmail(request.getEmail(), otp);
                return null;
        }

        // Admin Login (Password based, returns token directly)
        public String adminLogin(String email, String password) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(email, password));

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getRole() != Role.ADMIN) {
                        throw new RuntimeException("Access Denied: Not an Admin");
                }

                var userDetails = new com.app.security.CustomUserDetails(user);
                return jwtService.generateToken(userDetails);
        }

        // Create Admin (One time setup or seed)
        public void createAdmin(String email, String password) {
                if (userRepository.findByEmail(email).isEmpty()) {
                        User admin = User.builder()
                                        .email(email)
                                        .username("admin")
                                        .password(passwordEncoder.encode(password))
                                        .role(Role.ADMIN)
                                        .enabled(true)
                                        .build();
                        userRepository.save(admin);
                }
        }

        public void forgotPassword(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String otp = String.format("%06d", new Random().nextInt(999999));
                user.setOtp(otp);
                user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
                userRepository.save(user);

                emailService.sendOtpEmail(email, otp);
        }

        public void resetPassword(String email, String otp, String newPassword) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getOtp() == null || !user.getOtp().equals(otp)) {
                        throw new RuntimeException("Invalid OTP");
                }

                if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
                        throw new RuntimeException("OTP Expired");
                }

                user.setPassword(passwordEncoder.encode(newPassword));
                user.setOtp(null);
                user.setOtpExpiry(null);
                userRepository.save(user);
        }
}
