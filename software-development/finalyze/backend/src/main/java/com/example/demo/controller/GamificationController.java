package com.example.demo.controller;

import com.example.demo.model.Gamification;
import com.example.demo.service.GamificationService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {

  @Autowired private GamificationService gamificationService;

  @GetMapping("/user/{userId}")
  public ResponseEntity<Gamification> getGamificationForUser(@PathVariable Long userId) {
    Gamification gamificationRecord = gamificationService.getGamificationForUser(userId);
    if (gamificationRecord == null) {
      return ResponseEntity.notFound().build(); // Return 404 if no record is found
    }
    return ResponseEntity.ok(gamificationRecord);
  }

  @GetMapping("/user/{userId}/points")
  public ResponseEntity<Integer> getUserPoints(@PathVariable Long userId) {
    int points = gamificationService.getUserPoints(userId);
    return ResponseEntity.ok(points);
  }

  @PutMapping("/user/{userId}/points")
  public ResponseEntity<Gamification> updateUserPoints(
      @PathVariable Long userId, @RequestBody Map<String, Integer> body) {
    if (!body.containsKey("points")) {
      return ResponseEntity.badRequest().build();
    }

    int deltaPoints = body.get("points");
    Gamification updated = gamificationService.updateExpPoints(userId, deltaPoints);
    return ResponseEntity.ok(updated);
  }
}
