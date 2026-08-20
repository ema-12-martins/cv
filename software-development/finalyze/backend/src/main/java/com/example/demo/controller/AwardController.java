package com.example.demo.controller;

import com.example.demo.model.Award;
import com.example.demo.service.AwardService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/awards")
public class AwardController {
  private final AwardService awardService;

  @Autowired
  public AwardController(AwardService awardService) {
    this.awardService = awardService;
  }

  // Fetch all awards
  @GetMapping
  public ResponseEntity<List<Award>> getAllAwards() {
    List<Award> awards = awardService.getAllAwards();
    return ResponseEntity.ok(awards);
  }

  // Fetch awards received by a specific user
  @GetMapping("/user/{userId}/received")
  public ResponseEntity<List<Award>> getAwardsByUserId(@PathVariable Long userId) {
    List<Award> awards = awardService.getAwardsByUserId(userId);
    return ResponseEntity.ok(awards);
  }

  // Fetch awards not yet received by a specific user
  @GetMapping("/user/{userId}/unreceived")
  public ResponseEntity<List<Award>> getUnreceivedAwardsByUserId(@PathVariable Long userId) {
    List<Award> awards = awardService.getUnreceivedAwardsByUserId(userId);
    return ResponseEntity.ok(awards);
  }
}
