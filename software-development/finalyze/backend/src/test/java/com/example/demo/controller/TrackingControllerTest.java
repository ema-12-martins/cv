package com.example.demo.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.dto.TrackingEntriesRequest;
import com.example.demo.model.*;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.IncomeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.DocumentException;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(TrackingController.class)
class TrackingControllerTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;

  @MockBean private ExpenseRepository expenseRepository;
  @MockBean private IncomeRepository incomeRepository;

  @Autowired private TrackingController controller;

  private Income mockIncome(Long id, BigDecimal value, LocalDate date) {
    Income income = mock(Income.class);
    IncomeLabel label = mock(IncomeLabel.class);
    IncomeCategory category = mock(IncomeCategory.class);

    when(category.getName()).thenReturn("Salary");
    when(label.getCategory()).thenReturn(category);
    when(label.getName()).thenReturn("Work");

    when(income.getId()).thenReturn(id);
    when(income.getValue()).thenReturn(value);
    when(income.getLabel()).thenReturn(label);
    when(income.getOccurrenceDate()).thenReturn(date);

    return income;
  }

  private Expense mockExpense(Long id, BigDecimal value, LocalDate date) {
    Expense expense = mock(Expense.class);
    ExpenseLabel label = mock(ExpenseLabel.class);
    ExpenseCategory category = mock(ExpenseCategory.class);

    when(category.getName()).thenReturn("Food");
    when(label.getCategory()).thenReturn(category);
    when(label.getName()).thenReturn("Groceries");

    when(expense.getId()).thenReturn(id);
    when(expense.getValue()).thenReturn(value);
    when(expense.getLabel()).thenReturn(label);
    when(expense.getOccurrenceDate()).thenReturn(date);

    return expense;
  }

  @Test
  void testGetTrackingEntries_withDefaultSortingDescendingDate() {
    List<Income> incomes =
        List.of(mockIncome(1L, new BigDecimal("100.00"), LocalDate.of(2024, 5, 1)));
    List<Expense> expenses =
        List.of(mockExpense(2L, new BigDecimal("50.00"), LocalDate.of(2024, 4, 1)));

    when(incomeRepository.findByUserId(1L)).thenReturn(incomes);
    when(expenseRepository.findByUserId(1L)).thenReturn(expenses);

    ResponseEntity<List<TrackingEntriesRequest>> response =
        controller.getTrackingEntries(1L, 0, 10, "date", "desc");

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(2, response.getBody().size());
    assertEquals("income", response.getBody().get(0).getType()); // Newest first
  }

  @Test
  void testGetTrackingEntries_withAmountSortingAsc() {
    List<Income> incomes =
        List.of(mockIncome(1L, new BigDecimal("100.00"), LocalDate.of(2024, 5, 1)));
    List<Expense> expenses =
        List.of(mockExpense(2L, new BigDecimal("50.00"), LocalDate.of(2024, 4, 1)));

    when(incomeRepository.findByUserId(1L)).thenReturn(incomes);
    when(expenseRepository.findByUserId(1L)).thenReturn(expenses);

    ResponseEntity<List<TrackingEntriesRequest>> response =
        controller.getTrackingEntries(1L, 0, 10, "amount", "asc");

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(2, response.getBody().size());
    assertEquals("expense", response.getBody().get(0).getType()); // 50.00 first
  }

  @Test
  void testGetTrackingEntries_withPaginationOutOfRange() {
    when(incomeRepository.findByUserId(1L)).thenReturn(List.of());
    when(expenseRepository.findByUserId(1L)).thenReturn(List.of());

    ResponseEntity<List<TrackingEntriesRequest>> response =
        controller.getTrackingEntries(1L, 1, 10, "date", "desc"); // page 1, no data

    assertEquals(200, response.getStatusCodeValue());
    assertTrue(response.getBody().isEmpty());
  }

  @Test
  void testGetTrackingEntries_withInvalidSortOrderDefaultsToAsc() {
    List<Income> incomes =
        List.of(mockIncome(1L, new BigDecimal("200.00"), LocalDate.of(2024, 6, 1)));
    List<Expense> expenses =
        List.of(mockExpense(2L, new BigDecimal("300.00"), LocalDate.of(2024, 7, 1)));

    when(incomeRepository.findByUserId(1L)).thenReturn(incomes);
    when(expenseRepository.findByUserId(1L)).thenReturn(expenses);

    ResponseEntity<List<TrackingEntriesRequest>> response =
        controller.getTrackingEntries(1L, 0, 10, "amount", "INVALID");

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(2, response.getBody().size());
    assertEquals("income", response.getBody().get(0).getType()); // 200 < 300
  }

  @Test
  void testGetTrackingEntriesPdf_successfully() throws DocumentException, IOException {
    List<Income> incomes =
        List.of(mockIncome(1L, new BigDecimal("100.00"), LocalDate.of(2024, 5, 1)));
    List<Expense> expenses =
        List.of(mockExpense(2L, new BigDecimal("50.00"), LocalDate.of(2024, 4, 1)));

    when(incomeRepository.findByUserId(1L)).thenReturn(incomes);
    when(expenseRepository.findByUserId(1L)).thenReturn(expenses);

    ResponseEntity<byte[]> response = controller.getTrackingEntriesPdf(1L, "date", "desc");

    assertEquals(200, response.getStatusCodeValue());
    assertEquals("application/pdf", response.getHeaders().getContentType().toString());
    assertTrue(response.getBody().length > 0);
  }
}
