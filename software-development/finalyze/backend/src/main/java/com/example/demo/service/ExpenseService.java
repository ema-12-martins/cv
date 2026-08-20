package com.example.demo.service;

import com.example.demo.dto.ExpenseCategoryMonthSummary;
import com.example.demo.dto.ExpenseInsertRequest;
import com.example.demo.dto.ExpenseUpdateRequest;
import com.example.demo.model.Expense;
import com.example.demo.repository.ExpenseRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExpenseService {

  private final ExpenseRepository expenseRepository;
  private final GamificationService gamificationService;

  @Autowired
  public ExpenseService(
      ExpenseRepository expenseRepository, GamificationService gamificationService) {
    this.expenseRepository = expenseRepository;
    this.gamificationService = gamificationService;
  }

  public Double getTotalExpensesByUserId(Long userId) {
    Double total = expenseRepository.findTotalExpensesByUserId(userId);
    return total != null ? total : 0.0;
  }

  public List<Expense> getAllExpenses() {
    return expenseRepository.findAll();
  }

  public Expense getExpenseById(Long expenseId) {
    return expenseRepository
        .findById(expenseId)
        .orElseThrow(() -> new RuntimeException("Expense not found with id: " + expenseId));
  }

  public Expense createExpense(Long userId, Long labelId, ExpenseInsertRequest request) {
    Expense expense = new Expense();
    expense.setUserId(userId);
    expense.setLabelId(labelId);
    expense.setValue(request.getValue());
    expense.setOccurrenceDate(request.getOccurrenceDate());
    expense.setInsertionDate(LocalDate.now());

    Expense savedExpense = expenseRepository.save(expense);
    gamificationService.addExpPoints(userId, 5);

    return savedExpense;
  }

  public Expense saveExpense(Expense expense) {
    return expenseRepository.save(expense);
  }

  public Expense updateExpense(Long expenseId, ExpenseUpdateRequest request) {
    Expense expense =
        expenseRepository
            .findById(expenseId)
            .orElseThrow(() -> new RuntimeException("Expense not found"));

    expense.setValue(request.getValue());
    expense.setOccurrenceDate(request.getOccurrenceDate());
    expense.setLabelId(request.getLabel());

    return expenseRepository.save(expense);
  }

  public boolean deleteExpense(Long id) {
    Optional<Expense> existingExpense = expenseRepository.findById(id);
    if (existingExpense.isPresent()) {
      expenseRepository.delete(existingExpense.get());
      return true;
    }
    return false;
  }

  public List<ExpenseCategoryMonthSummary> getExpenseSummaryByCategoryAndMonth(
      Long userId, Integer year, Integer month) {
    return expenseRepository.getExpenseSumByCategory(userId, year, month);
  }

  public List<ExpenseCategoryMonthSummary> getAverageExpenseByCategory(
      Integer year, Integer month) {
    return expenseRepository.getAverageExpenseByCategory(year, month);
  }

  public Map<String, Double> getExpensesSummaryByCategory(Long userId, int months) {
    LocalDate startDate = LocalDate.now().minusMonths(months);
    List<Expense> expenses =
        expenseRepository.findByUserIdAndOccurrenceDateAfter(userId, startDate);

    return expenses.stream()
        .collect(
            Collectors.groupingBy(
                e -> e.getLabel().getCategory().getName(),
                Collectors.summingDouble(e -> e.getValue().doubleValue())));
  }

  public Double getTotalExpensesByUserIdAndCategoryName(Long userId, String categoryName) {
    return expenseRepository.findTotalExpensesByUserIdAndCategoryName(userId, categoryName);
  }

  public List<ExpenseCategoryMonthSummary> getExpenseSummaryByUserCategoryAndMonth(
      Long userId, Integer year, Integer month, Long categoryId) {

    return expenseRepository.getExpenseSumByUserAndCategory(userId, year, month, categoryId);
  }
}
