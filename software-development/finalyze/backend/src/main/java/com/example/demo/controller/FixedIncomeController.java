package com.example.demo.controller;

import com.example.demo.model.FixedIncome;
import com.example.demo.service.FixedIncomeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fixed_incomes")
public class FixedIncomeController {

  @Autowired private FixedIncomeService fixedIncomeService;

  @GetMapping
  public List<FixedIncome> getAllFixedIncomes() {
    return fixedIncomeService.getAllFixedIncomes();
  }

  // --- NEW ENDPOINT ADDED FOR USER-SPECIFIC FIXED INCOMES ---
  @GetMapping("/user/{userId}")
  public List<FixedIncome> getFixedIncomesByUserId(@PathVariable Long userId) {
    return fixedIncomeService.getFixedIncomesByUserId(userId);
  }

  @GetMapping("/{id}")
  public ResponseEntity<FixedIncome> getFixedIncomeById(@PathVariable Long id) {
    return fixedIncomeService
        .getFixedIncomeById(id)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public FixedIncome createFixedIncome(@RequestBody FixedIncome income) {
    return fixedIncomeService.saveFixedIncome(income);
  }

  @PutMapping("/{id}")
  public ResponseEntity<FixedIncome> updateFixedIncome(
      @PathVariable Long id, @RequestBody FixedIncome income) {
    if (fixedIncomeService.getFixedIncomeById(id).isPresent()) {
      income.setId(id);
      return ResponseEntity.ok(fixedIncomeService.saveFixedIncome(income));
    }
    return ResponseEntity.notFound().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteFixedIncome(@PathVariable Long id) {
    if (fixedIncomeService.getFixedIncomeById(id).isPresent()) {
      fixedIncomeService.deleteFixedIncome(id);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
