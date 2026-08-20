package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private Logger logger = LoggerFactory.getLogger(AuthController.class);

  @Autowired private UserService userService;

  @Autowired private PasswordEncoder passwordEncoder;

  private final SecurityContextRepository securityContextRepository =
      new HttpSessionSecurityContextRepository();

  @PostMapping("/register")
  public ResponseEntity<Map<String, Object>> registerUser(
      @RequestBody RegisterRequest registerRequest) {
    Map<String, Object> response = new HashMap<>();

    try {
      User user = new User();
      user.setName(registerRequest.getName());
      user.setEmail(registerRequest.getEmail());
      user.setMobileNumber(registerRequest.getMobileNumber());
      user.setBirthdate(registerRequest.getBirthdate());
      user.setPasswordHash(registerRequest.getPassword());

      userService.registerNewUser(user);

      response.put("success", true);
      response.put("message", "User registered successfully");
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (Exception e) {
      response.put("success", false);
      response.put("error", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> loginUser(
      @RequestBody LoginRequest loginRequest,
      HttpServletRequest request,
      HttpServletResponse response) {

    Map<String, Object> responseBody = new HashMap<>();

    try {
      UserDetails userDetails = userService.loadUserByUsername(loginRequest.getEmail());

      if (passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {
        userService.updateLastLogin(loginRequest.getEmail());

        // Manually authenticate
        UsernamePasswordAuthenticationToken auth =
            new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        auth.setDetails(new WebAuthenticationDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
        securityContextRepository.saveContext(
            SecurityContextHolder.getContext(), request, response);

        responseBody.put("success", true);
        responseBody.put("message", "Login successful");
        return ResponseEntity.ok(responseBody);
      } else {
        responseBody.put("success", false);
        responseBody.put("error", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
      }
    } catch (Exception e) {
      responseBody.put("success", false);
      responseBody.put("error", "User not found");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {
    Map<String, Object> response = new HashMap<>();
    request.getSession().invalidate();
    SecurityContextHolder.clearContext();

    response.put("success", true);
    response.put("message", "Logged out successfully");
    return ResponseEntity.ok(response);
  }
}
