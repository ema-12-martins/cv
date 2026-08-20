package com.example.demo.controller;

import com.example.demo.dto.ExpenseCategoryMonthSummary;
import com.example.demo.dto.ExpenseInsertRequest;
import com.example.demo.dto.ExpenseResponse;
import com.example.demo.dto.ExpenseSummaryRequest;
import com.example.demo.dto.ExpenseUpdateRequest;
import com.example.demo.model.Expense;
import com.example.demo.service.ExpenseService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

  @Autowired private ExpenseService expenseService;

  @GetMapping("/total/user/{userId}")
  public ResponseEntity<Double> getTotalExpensesByUser(@PathVariable Long userId) {
    Double total = expenseService.getTotalExpensesByUserId(userId);
    return ResponseEntity.ok(total);
  }

  @GetMapping
  public List<Expense> getAllExpenses() {
    return expenseService.getAllExpenses();
  }

  @GetMapping("/{expenseId}")
  public ResponseEntity<ExpenseResponse> getExpense(@PathVariable Long expenseId) {
    Expense expense = expenseService.getExpenseById(expenseId);
    ExpenseResponse response =
        new ExpenseResponse(
            expense.getId(),
            expense.getValue(),
            expense.getLabel().getName(),
            expense.getLabel().getCategory().getName(),
            expense.getOccurrenceDate());
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @PostMapping("/user/{userId}/label/{labelId}")
  public ResponseEntity<Expense> createExpense(
      @PathVariable Long userId,
      @PathVariable Long labelId,
      @RequestBody ExpenseInsertRequest request) {
    Expense expense = expenseService.createExpense(userId, labelId, request);
    return new ResponseEntity<>(expense, HttpStatus.CREATED);
  }

  @PutMapping("/{expenseId}")
  public ExpenseUpdateRequest updateExpense(
      @PathVariable Long expenseId, @RequestBody ExpenseUpdateRequest request) {

    Expense updatedExpense = expenseService.updateExpense(expenseId, request);
    return new ExpenseUpdateRequest(updatedExpense);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
    boolean isDeleted = expenseService.deleteExpense(id);
    if (isDeleted) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping("/summary/user")
  public ResponseEntity<List<ExpenseCategoryMonthSummary>> getExpenseSummaryByCategoryAndMonth(
      @RequestBody ExpenseSummaryRequest request) {

    List<ExpenseCategoryMonthSummary> summary =
        expenseService.getExpenseSummaryByCategoryAndMonth(
            request.getUserId(), request.getYear(), request.getMonth());

    return ResponseEntity.ok(summary);
  }

  @PostMapping("/summary/average")
  public ResponseEntity<List<ExpenseCategoryMonthSummary>> getAverageExpenseByCategory(
      @RequestBody ExpenseSummaryRequest request) {

    List<ExpenseCategoryMonthSummary> summary =
        expenseService.getAverageExpenseByCategory(request.getYear(), request.getMonth());
    return ResponseEntity.ok(summary);
  }

  @GetMapping("/summary/user/{userId}")
  public ResponseEntity<Map<String, Double>> getExpensesByCategory(
      @PathVariable Long userId, @RequestParam int months) {
    Map<String, Double> summary = expenseService.getExpensesSummaryByCategory(userId, months);
    return ResponseEntity.ok(summary);
  }

  @GetMapping("/total/user/{userId}/category/{categoryName}")
  public ResponseEntity<Double> getTotalExpensesByUserIdAndCategoryName(
      @PathVariable Long userId, @PathVariable String categoryName) {
    Double totalExpenses =
        expenseService.getTotalExpensesByUserIdAndCategoryName(userId, categoryName);
    return ResponseEntity.ok(totalExpenses != null ? totalExpenses : 0.0);
  }

  @PostMapping("/summary/user/category")
  public ResponseEntity<List<ExpenseCategoryMonthSummary>> getExpenseSummaryByUserCategoryAndMonth(
      @RequestBody ExpenseSummaryRequest request) {

    List<ExpenseCategoryMonthSummary> summary =
        expenseService.getExpenseSummaryByUserCategoryAndMonth(
            request.getUserId(), request.getYear(), request.getMonth(), request.getCategoryId());

    return ResponseEntity.ok(summary);
  }
}
