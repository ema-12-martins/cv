package com.example.demo.controller;

import com.example.demo.model.SavingsTarget;
import com.example.demo.service.SavingsTargetService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/savings-target")
public class SavingsTargetController {
  private final SavingsTargetService savingsTargetService;

  @Autowired
  public SavingsTargetController(SavingsTargetService savingsTargetService) {
    this.savingsTargetService = savingsTargetService;
  }

  @GetMapping("/highest-priority")
  public ResponseEntity<SavingsTarget> getHighestPrioritySavingsTarget(@RequestParam Long userId) {
    Optional<SavingsTarget> savingsTarget =
        savingsTargetService.getHighestPrioritySavingsTarget(userId);
    return savingsTarget.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<SavingsTarget> createSavingsTarget(
      @RequestBody SavingsTarget savingsTarget) {
    SavingsTarget saved = savingsTargetService.saveSavingsTarget(savingsTarget);
    return ResponseEntity.ok(saved);
  }

  @GetMapping("/count")
  public ResponseEntity<Long> countSavingsTargets(@RequestParam Long userId) {
    long count = savingsTargetService.countSavingsTargetsByUserId(userId);
    return ResponseEntity.ok(count);
  }

  @GetMapping("/user")
  public ResponseEntity<List<SavingsTarget>> getSavingsTargetsByUserId(@RequestParam Long userId) {
    List<SavingsTarget> savingsTargets = savingsTargetService.getAllByUserId(userId);
    return ResponseEntity.ok(savingsTargets);
  }

  @PutMapping("/reorder")
  public ResponseEntity<Void> reorderSavingGoals(@RequestBody List<SavingsTarget> updatedGoals) {
    for (SavingsTarget goal : updatedGoals) {
      Optional<SavingsTarget> existing = savingsTargetService.getById(goal.getId());
      if (existing.isPresent()) {
        SavingsTarget g = existing.get();
        g.setPriority(goal.getPriority());
        savingsTargetService.saveSavingsTarget(g);
      }
    }
    return ResponseEntity.ok().build();
  }
}
