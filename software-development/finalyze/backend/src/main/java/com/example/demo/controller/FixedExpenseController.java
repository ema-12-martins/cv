package com.example.demo.controller;

import com.example.demo.model.FixedExpense;
import com.example.demo.service.FixedExpenseService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fixed_expenses")
public class FixedExpenseController {

  @Autowired private FixedExpenseService fixedExpenseService;

  @GetMapping
  public List<FixedExpense> getAllFixedExpenses() {
    return fixedExpenseService.getAllFixedExpenses();
  }

  @GetMapping("/{id}")
  public ResponseEntity<FixedExpense> getFixedExpenseById(@PathVariable Long id) {
    return fixedExpenseService
        .getFixedExpenseById(id)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  // --- NEW ENDPOINT ADDED FOR USER-SPECIFIC FIXED EXPENSES ---
  @GetMapping("/user/{userId}")
  public List<FixedExpense> getFixedExpensesByUserId(@PathVariable Long userId) {
    return fixedExpenseService.getFixedExpensesByUserId(userId);
  }

  // --- END NEW ENDPOINT ---

  @PostMapping
  public FixedExpense createFixedExpense(@RequestBody FixedExpense expense) {
    return fixedExpenseService.saveFixedExpense(expense);
  }

  @PutMapping("/{id}")
  public ResponseEntity<FixedExpense> updateFixedExpense(
      @PathVariable Long id, @RequestBody FixedExpense expense) {
    if (fixedExpenseService.getFixedExpenseById(id).isPresent()) {
      expense.setId(id);
      return ResponseEntity.ok(fixedExpenseService.saveFixedExpense(expense));
    }
    return ResponseEntity.notFound().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteFixedExpense(@PathVariable Long id) {
    if (fixedExpenseService.getFixedExpenseById(id).isPresent()) {
      fixedExpenseService.deleteFixedExpense(id);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
