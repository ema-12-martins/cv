package com.example.demo.controller;

import com.example.demo.model.ExpenseCategory;
import com.example.demo.service.ExpenseCategoryService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expense_categories")
public class ExpenseCategoryController {

  @Autowired private ExpenseCategoryService expenseCategoryService;

  @GetMapping
  public List<ExpenseCategory> getAllCategories() {
    return expenseCategoryService.getAllCategories();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ExpenseCategory> getCategoryById(@PathVariable Long id) {
    return expenseCategoryService
        .getCategoryById(id)
        .map(category -> ResponseEntity.ok(category))
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ExpenseCategory createCategory(@RequestBody ExpenseCategory category) {
    return expenseCategoryService.saveCategory(category);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ExpenseCategory> updateCategory(
      @PathVariable Long id, @RequestBody ExpenseCategory category) {
    if (expenseCategoryService.getCategoryById(id).isPresent()) {
      category.setId(id);
      return ResponseEntity.ok(expenseCategoryService.saveCategory(category));
    }
    return ResponseEntity.notFound().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
    if (expenseCategoryService.getCategoryById(id).isPresent()) {
      expenseCategoryService.deleteCategory(id);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
