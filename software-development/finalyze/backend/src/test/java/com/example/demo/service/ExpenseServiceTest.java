package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.dto.ExpenseCategoryMonthSummary;
import com.example.demo.dto.ExpenseInsertRequest;
import com.example.demo.dto.ExpenseUpdateRequest;
import com.example.demo.model.Expense;
import com.example.demo.model.ExpenseCategory;
import com.example.demo.model.ExpenseLabel;
import com.example.demo.repository.ExpenseRepository;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

class ExpenseServiceTest {

  private ExpenseRepository expenseRepository;
  private GamificationService gamificationService;

  private ExpenseService expenseService;

  @BeforeEach
  void setUp() {
    expenseRepository = mock(ExpenseRepository.class);
    gamificationService = mock(GamificationService.class);
    expenseService = new ExpenseService(expenseRepository, gamificationService);
  }

  @Test
  void testGetTotalExpensesByUserId_returnsValue() {
    when(expenseRepository.findTotalExpensesByUserId(1L)).thenReturn(150.0);

    Double total = expenseService.getTotalExpensesByUserId(1L);

    assertEquals(150.0, total);
    verify(expenseRepository).findTotalExpensesByUserId(1L);
  }

  @Test
  void testGetTotalExpensesByUserId_returnsZeroWhenNull() {
    when(expenseRepository.findTotalExpensesByUserId(1L)).thenReturn(null);

    Double total = expenseService.getTotalExpensesByUserId(1L);

    assertEquals(0.0, total);
  }

  @Test
  void testGetAllExpenses_returnsList() {
    List<Expense> mockList = List.of(new Expense(), new Expense());
    when(expenseRepository.findAll()).thenReturn(mockList);

    List<Expense> result = expenseService.getAllExpenses();

    assertEquals(2, result.size());
    verify(expenseRepository).findAll();
  }

  @Test
  void testGetExpenseById_found() {
    Expense expense = new Expense();
    when(expenseRepository.findById(5L)).thenReturn(Optional.of(expense));

    Expense result = expenseService.getExpenseById(5L);

    assertNotNull(result);
    verify(expenseRepository).findById(5L);
  }

  @Test
  void testGetExpenseById_notFound_throws() {
    when(expenseRepository.findById(5L)).thenReturn(Optional.empty());

    RuntimeException ex =
        assertThrows(RuntimeException.class, () -> expenseService.getExpenseById(5L));
    assertTrue(ex.getMessage().contains("Expense not found with id"));
  }

  @Test
  void testCreateExpense_savesAndAddsPoints() {
    ExpenseInsertRequest req = new ExpenseInsertRequest();
    req.setValue(new BigDecimal(100));
    req.setOccurrenceDate(LocalDate.of(2025, 6, 1));

    when(expenseRepository.save(any(Expense.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    Expense result = expenseService.createExpense(1L, 2L, req);

    assertEquals(1L, result.getUserId());
    assertEquals(2L, result.getLabelId());
    assertEquals(new BigDecimal(100), result.getValue());
    assertEquals(LocalDate.of(2025, 6, 1), result.getOccurrenceDate());
    assertNotNull(result.getInsertionDate());

    verify(expenseRepository).save(any(Expense.class));
    verify(gamificationService).addExpPoints(1L, 5);
  }

  @Test
  void testSaveExpense_delegatesToRepository() {
    Expense expense = new Expense();
    when(expenseRepository.save(expense)).thenReturn(expense);

    Expense result = expenseService.saveExpense(expense);

    assertEquals(expense, result);
    verify(expenseRepository).save(expense);
  }

  @Test
  void testUpdateExpense_foundAndUpdated() {
    ExpenseUpdateRequest req = new ExpenseUpdateRequest();
    req.setValue(new BigDecimal(55));
    req.setOccurrenceDate(LocalDate.of(2025, 5, 20));
    req.setLabel(3L);

    Expense existing = new Expense();
    existing.setValue(new BigDecimal(40));
    existing.setOccurrenceDate(LocalDate.of(2025, 5, 1));
    existing.setLabelId(1L);

    Expense saved = new Expense();
    saved.setValue(new BigDecimal(55));
    saved.setOccurrenceDate(LocalDate.of(2025, 5, 20));
    saved.setLabelId(3L);

    when(expenseRepository.findById(10L)).thenReturn(Optional.of(existing));
    when(expenseRepository.save(existing)).thenReturn(saved);

    Expense result = expenseService.updateExpense(10L, req);

    assertEquals(new BigDecimal(55), result.getValue());
    assertEquals(LocalDate.of(2025, 5, 20), result.getOccurrenceDate());
    assertEquals(3L, result.getLabelId());

    verify(expenseRepository).findById(10L);
    verify(expenseRepository).save(existing);
  }

  @Test
  void testUpdateExpense_notFound_throws() {
    ExpenseUpdateRequest req = new ExpenseUpdateRequest();

    when(expenseRepository.findById(10L)).thenReturn(Optional.empty());

    RuntimeException ex =
        assertThrows(RuntimeException.class, () -> expenseService.updateExpense(10L, req));
    assertEquals("Expense not found", ex.getMessage());
  }

  @Test
  void testDeleteExpense_present_returnsTrue() {
    Expense expense = new Expense();
    when(expenseRepository.findById(8L)).thenReturn(Optional.of(expense));

    boolean result = expenseService.deleteExpense(8L);

    assertTrue(result);
    verify(expenseRepository).delete(expense);
  }

  @Test
  void testDeleteExpense_notPresent_returnsFalse() {
    when(expenseRepository.findById(8L)).thenReturn(Optional.empty());

    boolean result = expenseService.deleteExpense(8L);

    assertFalse(result);
    verify(expenseRepository, never()).delete(any());
  }

  @Test
  void testGetExpenseSummaryByCategoryAndMonth_returnsList() {
    List<ExpenseCategoryMonthSummary> summaries =
        List.of(new ExpenseCategoryMonthSummary("Transport", new BigDecimal("76.54")));
    when(expenseRepository.getExpenseSumByCategory(1L, 2025, 6)).thenReturn(summaries);

    List<ExpenseCategoryMonthSummary> result =
        expenseService.getExpenseSummaryByCategoryAndMonth(1L, 2025, 6);

    assertEquals(summaries, result);
  }

  @Test
  void testGetAverageExpenseByCategory_returnsList() {
    List<ExpenseCategoryMonthSummary> summaries =
        List.of(new ExpenseCategoryMonthSummary("Transport", new BigDecimal("76.54")));
    when(expenseRepository.getAverageExpenseByCategory(2025, 6)).thenReturn(summaries);

    List<ExpenseCategoryMonthSummary> result = expenseService.getAverageExpenseByCategory(2025, 6);

    assertEquals(summaries, result);
  }

  @Test
  void testGetExpensesSummaryByCategory_returnsMap() throws Exception {
    // Arrange
    ExpenseCategory category = new ExpenseCategory();
    category.setName("Food");
    category.setId(1L);

    ExpenseLabel label = new ExpenseLabel();
    label.setCategoryId(category.getId());
    label.setId(1L);

    Expense e1 = new Expense();
    e1.setValue(new BigDecimal("55"));
    e1.setLabelId(label.getId());

    Expense e2 = new Expense();
    e2.setValue(new BigDecimal("75.5"));
    e2.setLabelId(label.getId());

    Field labelField = Expense.class.getDeclaredField("label");
    labelField.setAccessible(true);
    labelField.set(e1, label);
    labelField.set(e2, label);

    Field categoryField = ExpenseLabel.class.getDeclaredField("category");
    categoryField.setAccessible(true);
    categoryField.set(label, category);

    List<Expense> expenses = List.of(e1, e2);

    when(expenseRepository.findByUserIdAndOccurrenceDateAfter(eq(1L), any(LocalDate.class)))
        .thenReturn(expenses);

    // Act
    Map<String, Double> summary = expenseService.getExpensesSummaryByCategory(1L, 3);

    // Assert
    assertEquals(1, summary.size());
    assertEquals(130.5, summary.get("Food"));
  }

  @Test
  void testGetTotalExpensesByUserIdAndCategoryName_returnsValue() {
    when(expenseRepository.findTotalExpensesByUserIdAndCategoryName(1L, "Food")).thenReturn(120.0);

    Double total = expenseService.getTotalExpensesByUserIdAndCategoryName(1L, "Food");

    assertEquals(120.0, total);
  }

  @Test
  void testGetExpenseSummaryByUserCategoryAndMonth_returnsList() {
    List<ExpenseCategoryMonthSummary> summaries =
        List.of(new ExpenseCategoryMonthSummary("Transport", new BigDecimal("76.54")));
    when(expenseRepository.getExpenseSumByUserAndCategory(1L, 2025, 6, 2L)).thenReturn(summaries);

    List<ExpenseCategoryMonthSummary> result =
        expenseService.getExpenseSummaryByUserCategoryAndMonth(1L, 2025, 6, 2L);

    assertEquals(summaries, result);
  }
}
