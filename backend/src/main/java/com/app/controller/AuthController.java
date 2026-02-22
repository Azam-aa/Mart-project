package com.app.controller;

import com.app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend
public class AuthController {

    private final AuthService authService;
    private final com.app.repository.UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody com.app.dto.SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + request.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody com.app.dto.LoginRequest request) {
        String token = authService.login(request);
        if (token != null) {
            // Find user to get role for response
            com.app.model.User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            return ResponseEntity.ok(Map.of("token", token, "role", user.getRole().name(), "username",
                    user.getUsername(), "otpRequired", false));
        }
        return ResponseEntity
                .ok(Map.of("message", "OTP sent successfully to " + request.getEmail(), "otpRequired", true));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.sendOtp(email);
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + email));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody com.app.dto.VerifyOtpRequest request) {
        String token = authService.verifyOtp(request.getEmail(), request.getOtp());
        com.app.model.User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        return ResponseEntity.ok(Map.of("token", token, "role", user.getRole().name(), "username", user.getUsername()));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String token = authService.adminLogin(email, password);
        return ResponseEntity.ok(Map.of("token", token, "role", "ADMIN"));
    }

    @PostMapping("/admin/create")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> request) {
        // This endpoint should inherently be protected or removed in prod, but for
        // setup:
        String email = request.get("email");
        String password = request.get("password");
        authService.createAdmin(email, password);
        return ResponseEntity.ok("Admin created");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        authService.forgotPassword(request.get("email"));
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        authService.resetPassword(request.get("email"), request.get("otp"), request.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
}
