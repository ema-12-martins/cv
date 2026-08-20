package com.example.demo.controller;

import com.example.demo.model.ExpenseTarget;
import com.example.demo.service.ExpenseTargetService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expense_targets")
public class ExpenseTargetController {

  @Autowired private ExpenseTargetService service;

  @GetMapping
  public List<ExpenseTarget> getAll() {
    return service.getAll();
  }

  @GetMapping("/{categoryId}/{userId}")
  public ResponseEntity<ExpenseTarget> getById(
      @PathVariable Long categoryId, @PathVariable Long userId) {
    return service
        .getById(categoryId, userId)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ExpenseTarget create(@RequestBody ExpenseTarget target) {
    return service.save(target);
  }

  @PutMapping("/{categoryId}/{userId}")
  public ResponseEntity<ExpenseTarget> update(
      @PathVariable Long categoryId,
      @PathVariable Long userId,
      @RequestBody ExpenseTarget updatedTarget) {

    if (service.getById(categoryId, userId).isPresent()) {
      updatedTarget.setExpenseCategoryId(categoryId);
      updatedTarget.setUserId(userId);
      return ResponseEntity.ok(service.save(updatedTarget));
    }
    return ResponseEntity.notFound().build();
  }

  @DeleteMapping("/{categoryId}/{userId}")
  public ResponseEntity<Void> delete(@PathVariable Long categoryId, @PathVariable Long userId) {
    if (service.getById(categoryId, userId).isPresent()) {
      service.delete(categoryId, userId);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
