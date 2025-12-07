package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.dto.AuthRequest;
import com.upec.gl.examsurveillance.dto.AuthResponse;
import com.upec.gl.examsurveillance.dto.RegisterRequest;
import com.upec.gl.examsurveillance.model.Role;
import com.upec.gl.examsurveillance.model.Enseignant;
import com.upec.gl.examsurveillance.repository.EnseignantRepository;
import com.upec.gl.examsurveillance.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Operation(summary = "Login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful, JWT token returned"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final Enseignant enseignant = enseignantRepository.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Enseignant not found"));

        final String jwt = jwtUtil.generateToken(userDetails.getUsername(), enseignant.getRole().name());

        AuthResponse response = new AuthResponse(
                jwt,
                enseignant.getId(),
                enseignant.getUsername(),
                enseignant.getEmail(),
                enseignant.getRole().name());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Register new user", description = "Create a new enseignant account with role (ADMIN or TEACHER)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registration successful, JWT token returned"),
            @ApiResponse(responseCode = "400", description = "Username/email already exists or invalid role")
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        // Check if username already exists
        if (enseignantRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Check if email already exists
        if (enseignantRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Enseignant enseignant = new Enseignant();
        enseignant.setUsername(registerRequest.getUsername());
        enseignant.setEmail(registerRequest.getEmail());
        enseignant.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        try {
            enseignant.setRole(Role.valueOf(registerRequest.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role. Must be ADMIN or TEACHER");
        }

        Enseignant savedEnseignant = enseignantRepository.save(enseignant);

        final String jwt = jwtUtil.generateToken(savedEnseignant.getUsername(), savedEnseignant.getRole().name());

        AuthResponse response = new AuthResponse(
                jwt,
                savedEnseignant.getId(),
                savedEnseignant.getUsername(),
                savedEnseignant.getEmail(),
                savedEnseignant.getRole().name());

        return ResponseEntity.ok(response);
    }
}
