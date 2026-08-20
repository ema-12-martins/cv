package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

  @Autowired private UserService userService;

  @GetMapping("/me")
  public ResponseEntity<?> getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();

    User user = (User) userService.loadUserByUsername(email);

    // don't send the password hash in the response
    user.setPasswordHash(null);

    return ResponseEntity.ok(user);
  }

  @PutMapping("/update")
  public ResponseEntity<User> updateProfile(
      @AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, Object> updates) {

    User updatedUser = userService.updateUser(userDetails.getUsername(), updates);
    return ResponseEntity.ok(updatedUser);
  }

  @DeleteMapping("/delete")
  public ResponseEntity<?> deleteAccount(
      @AuthenticationPrincipal UserDetails userDetails, HttpServletRequest request) {
    userService.deleteUser(userDetails.getUsername());
    request.getSession().invalidate();
    return ResponseEntity.ok(Map.of("success", true, "message", "Account deleted"));
  }

  @GetMapping("/{id}/lastPercentage")
  public ResponseEntity<BigDecimal> getLastPercentage(@PathVariable Long id) {
    BigDecimal lastPercentage = userService.getLastPercentageByIdOrZero(id);
    return ResponseEntity.ok(lastPercentage);
  }

  @PutMapping("/{id}/lastPercentage")
  public ResponseEntity<User> updateLastPercentage(
      @PathVariable Long id, @RequestBody Map<String, Object> body) {

    if (!body.containsKey("lastPercentage")) {
      return ResponseEntity.badRequest().build();
    }

    Object val = body.get("lastPercentage");
    BigDecimal lastPercentage;

    try {
      if (val instanceof String) {
        lastPercentage = new BigDecimal((String) val);
      } else if (val instanceof Number) {
        lastPercentage = BigDecimal.valueOf(((Number) val).doubleValue());
      } else {
        return ResponseEntity.badRequest().build();
      }
    } catch (NumberFormatException e) {
      return ResponseEntity.badRequest().build();
    }

    User updatedUser = userService.updateLastPercentage(id, lastPercentage);
    return ResponseEntity.ok(updatedUser);
  }
}
