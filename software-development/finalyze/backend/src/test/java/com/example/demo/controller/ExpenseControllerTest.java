package com.example.demo.controller;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.dto.ExpenseCategoryMonthSummary;
import com.example.demo.dto.ExpenseInsertRequest;
import com.example.demo.dto.ExpenseSummaryRequest;
import com.example.demo.dto.ExpenseUpdateRequest;
import com.example.demo.model.*;
import com.example.demo.service.ExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ExpenseController.class)
public class ExpenseControllerTest {
  @Autowired private MockMvc mockMvc;

  @MockBean private ExpenseService expenseService;

  @Autowired private ObjectMapper objectMapper;

  @WithMockUser(username = "test")
  @Test
  void testGetExpense_returnsExpenseResponse() throws Exception {
    Expense expense = mock(Expense.class);

    when(expense.getId()).thenReturn(1L);
    when(expense.getValue()).thenReturn(new BigDecimal("1000.0"));

    ExpenseLabel expenseLabel = mock(ExpenseLabel.class);
    when(expense.getLabel()).thenReturn(expenseLabel);
    when(expenseLabel.getName()).thenReturn("Rent");
    when(expense.getLabel().getName()).thenReturn("Rent");

    ExpenseCategory expenseCategory = mock(ExpenseCategory.class);
    when(expenseLabel.getCategory()).thenReturn(expenseCategory);
    when(expenseCategory.getName()).thenReturn("Expense");

    when(expense.getOccurrenceDate()).thenReturn(LocalDate.of(2025, 5, 1));

    when(expenseService.getExpenseById(1L)).thenReturn(expense);

    mockMvc
        .perform(get("/api/expenses/1").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1L))
        .andExpect(jsonPath("$.value").value(1000.00))
        .andExpect(jsonPath("$.labelName").value("Rent"))
        .andExpect(jsonPath("$.categoryName").value("Expense"))
        .andExpect(jsonPath("$.occurrenceDate").value("2025-05-01"));
  }

  @WithMockUser(username = "test")
  @Test
  void testCreateExpense_returnsCreatedExpense() throws Exception {
    // Create real input request
    ExpenseInsertRequest request = new ExpenseInsertRequest();
    request.setValue(new BigDecimal("1200.00"));
    request.setOccurrenceDate(LocalDate.of(2025, 5, 1));

    Expense expense = new Expense();
    expense.setId(10L);
    expense.setValue(request.getValue());
    expense.setOccurrenceDate(request.getOccurrenceDate());
    expense.setLabelId(2L);

    when(expenseService.createExpense(eq(1L), eq(2L), any(ExpenseInsertRequest.class)))
        .thenReturn(expense);

    mockMvc
        .perform(
            post("/api/expenses/user/1/label/2")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(10L))
        .andExpect(jsonPath("$.value").value(1200.00))
        .andExpect(jsonPath("$.occurrenceDate").value("2025-05-01"))
        .andExpect(jsonPath("$.labelId").value(2L));
  }

  @WithMockUser(username = "test")
  @Test
  void testDeleteExpense_returnsNoContent() throws Exception {
    when(expenseService.deleteExpense(1L)).thenReturn(true);

    mockMvc.perform(delete("/api/expenses/1").with(csrf())).andExpect(status().isNoContent());

    verify(expenseService, times(1)).deleteExpense(1L);
  }

  @WithMockUser(username = "test")
  @Test
  void testUpdateExpense_returnsUpdatedRequest() throws Exception {
    ExpenseUpdateRequest updateRequest = new ExpenseUpdateRequest();
    updateRequest.setValue(new BigDecimal("1300.00"));
    updateRequest.setOccurrenceDate(LocalDate.of(2025, 6, 1));

    Expense updatedExpense = mock(Expense.class);
    when(updatedExpense.getId()).thenReturn(1L);
    when(updatedExpense.getValue()).thenReturn(updateRequest.getValue());
    when(updatedExpense.getOccurrenceDate()).thenReturn(updateRequest.getOccurrenceDate());

    ExpenseLabel label = mock(ExpenseLabel.class);
    ExpenseCategory category = mock(ExpenseCategory.class);
    when(label.getName()).thenReturn("Sports");
    when(category.getName()).thenReturn("Expense");
    when(label.getCategory()).thenReturn(category);
    when(updatedExpense.getLabel()).thenReturn(label);

    when(expenseService.updateExpense(eq(1L), any(ExpenseUpdateRequest.class)))
        .thenReturn(updatedExpense);

    mockMvc
        .perform(
            put("/api/expenses/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.value").value(1300.00))
        .andExpect(jsonPath("$.occurrenceDate").value("2025-06-01"));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetAllExpenses_returnsList() throws Exception {
    Expense expense = new Expense();
    expense.setId(1L);

    when(expenseService.getAllExpenses()).thenReturn(List.of(expense));

    mockMvc
        .perform(get("/api/expenses").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1L));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetTotalExpensesByUser_returnsTotal() throws Exception {
    when(expenseService.getTotalExpensesByUserId(1L)).thenReturn(2500.0);

    mockMvc
        .perform(get("/api/expenses/total/user/1").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().string("2500.0"));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetTotalExpensesByUserIdAndCategory_returnsValue() throws Exception {
    when(expenseService.getTotalExpensesByUserIdAndCategoryName(1L, "Food")).thenReturn(1500.0);

    mockMvc
        .perform(get("/api/expenses/total/user/1/category/Food").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().string("1500.0"));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetTotalExpensesByUserIdAndCategory_returnsZeroIfNull() throws Exception {
    when(expenseService.getTotalExpensesByUserIdAndCategoryName(1L, "Unknown")).thenReturn(null);

    mockMvc
        .perform(get("/api/expenses/total/user/1/category/Unknown").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().string("0.0"));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetExpensesByCategory_returnsSummary() throws Exception {
    when(expenseService.getExpensesSummaryByCategory(1L, 3)).thenReturn(Map.of("Food", 200.0));

    mockMvc
        .perform(get("/api/expenses/summary/user/1?months=3").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.Food").value(200.0));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetExpenseSummaryByCategoryAndMonth_returnsSummary() throws Exception {
    ExpenseSummaryRequest request = new ExpenseSummaryRequest(1L, 2025, 5, null);
    List<ExpenseCategoryMonthSummary> summaries =
        List.of(new ExpenseCategoryMonthSummary("Food", new BigDecimal("123.45")));

    when(expenseService.getExpenseSummaryByCategoryAndMonth(1L, 2025, 5)).thenReturn(summaries);

    mockMvc
        .perform(
            post("/api/expenses/summary/user")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].categoryName").value("Food"))
        .andExpect(jsonPath("$[0].total").value(123.45));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetAverageExpenseByCategory_returnsSummary() throws Exception {
    ExpenseSummaryRequest request = new ExpenseSummaryRequest(null, 2025, 5, null);
    List<ExpenseCategoryMonthSummary> summaries =
        List.of(new ExpenseCategoryMonthSummary("Leisure", new BigDecimal("98.76")));

    when(expenseService.getAverageExpenseByCategory(2025, 5)).thenReturn(summaries);

    mockMvc
        .perform(
            post("/api/expenses/summary/average")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].categoryName").value("Leisure"))
        .andExpect(jsonPath("$[0].total").value(98.76));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetExpenseSummaryByUserCategoryAndMonth_returnsSummary() throws Exception {
    ExpenseSummaryRequest request = new ExpenseSummaryRequest(1L, 2025, 5, 2L);
    List<ExpenseCategoryMonthSummary> summaries =
        List.of(new ExpenseCategoryMonthSummary("Transport", new BigDecimal("76.54")));

    when(expenseService.getExpenseSummaryByUserCategoryAndMonth(1L, 2025, 5, 2L))
        .thenReturn(summaries);

    mockMvc
        .perform(
            post("/api/expenses/summary/user/category")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].categoryName").value("Transport"))
        .andExpect(jsonPath("$[0].total").value(76.54));
  }

  @WithMockUser(username = "test")
  @Test
  void testDeleteExpense_returnsNotFoundWhenNotDeleted() throws Exception {
    when(expenseService.deleteExpense(99L)).thenReturn(false);

    mockMvc.perform(delete("/api/expenses/99").with(csrf())).andExpect(status().isNotFound());
  }
}
