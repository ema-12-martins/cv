package com.example.demo.controller;

import com.example.demo.model.ExpenseLabel;
import com.example.demo.repository.ExpenseLabelRepository;
import com.example.demo.service.ExpenseLabelService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expense-labels")
public class ExpenseLabelController {

  private final ExpenseLabelRepository expenseLabelRepository;
  private ExpenseLabelService expenseLabelService;

  @Autowired
  public ExpenseLabelController(
      ExpenseLabelService expenseLabelService, ExpenseLabelRepository expenseLabelRepository) {
    this.expenseLabelService = expenseLabelService;
    this.expenseLabelRepository = expenseLabelRepository;
  }

  @GetMapping
  public List<ExpenseLabel> getAllLabels() {
    return expenseLabelService.getAllLabels();
  }

  @GetMapping("/user/{userId}/category/{categoryId}")
  public List<ExpenseLabel> getLabelsByUserIdAndCategoryId(
      @PathVariable Long userId, @PathVariable Long categoryId) {
    return expenseLabelService.getLabelsByUserIdAndCategoryId(userId, categoryId);
  }

  @PostMapping("/user/{userId}/category/{categoryId}")
  public ResponseEntity<ExpenseLabel> createLabel(
      @PathVariable Long userId,
      @PathVariable Long categoryId,
      @RequestBody ExpenseLabel labelRequest) {

    ExpenseLabel label = new ExpenseLabel();
    label.setUserId(Long.valueOf(userId));
    label.setCategoryId(Long.valueOf(categoryId));
    label.setName(labelRequest.getName());
    label.setSpent(0.0);
    label.setTarget(0.0);

    ExpenseLabel saved = expenseLabelRepository.save(label);
    return ResponseEntity.ok(saved);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ExpenseLabel> updateLabel(
      @PathVariable Long id, @RequestBody ExpenseLabel label) {
    if (expenseLabelService.getLabelById(id).isPresent()) {
      label.setId(id);
      return ResponseEntity.ok(expenseLabelService.saveLabel(label));
    }
    return ResponseEntity.notFound().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteLabel(@PathVariable Long id) {
    if (expenseLabelService.getLabelById(id).isPresent()) {
      expenseLabelService.deleteLabel(id);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
