package com.smarthire.service;

import com.smarthire.dto.AuthResponse;
import com.smarthire.dto.LoginRequest;
import com.smarthire.dto.RegisterRequest;
import com.smarthire.model.User;
import com.smarthire.repository.UserRepository;
import com.smarthire.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    // Register logic
    public AuthResponse register(RegisterRequest request) {

        // 1. Check karo — email already exist toh nahi karti?
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        // 2. Naya user banao
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt
        user.setRole("USER");

        // 3. Database mein save karo
        userRepository.save(user);

        // 4. Token banao aur return karo
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    // Login logic
    public AuthResponse login(LoginRequest request) {

        // 1. Email aur password verify karo
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. User database se nikalo
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 3. Token banao aur return karo
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token);
    }
}