package com.app.service;

import com.app.dto.AuthRequest;
import com.app.dto.AuthResponse;
import com.app.model.Role;
import com.app.model.User;
import com.app.repository.UserRepository;
import com.app.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // ✅ REGISTER USER
    public AuthResponse register(AuthRequest request) {

        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // default role
                .build();

        userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user.getUsername());

        return new AuthResponse(token);
    }

    // ✅ LOGIN USER
    public AuthResponse login(AuthRequest request) {

        // Find user
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user.getUsername());

        return new AuthResponse(token);
    }
}
