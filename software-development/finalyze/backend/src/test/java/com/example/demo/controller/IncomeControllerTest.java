package com.example.demo.controller;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.dto.IncomeInsertRequest;
import com.example.demo.dto.IncomeUpdateRequest;
import com.example.demo.model.Income;
import com.example.demo.model.IncomeCategory;
import com.example.demo.model.IncomeLabel;
import com.example.demo.service.IncomeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(IncomeController.class)
class IncomeControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private IncomeService incomeService;

  @Autowired private ObjectMapper objectMapper;

  @WithMockUser
  @Test
  void testGetTotalIncomeByUserId_returnsTotalIncome() throws Exception {
    when(incomeService.getTotalIncomeByUserId(1L)).thenReturn(new BigDecimal("5000.00"));

    mockMvc
        .perform(get("/api/incomes/user/1/total").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().string("5000.00"));
  }

  @WithMockUser
  @Test
  void testGetIncome_returnsIncomeResponse() throws Exception {
    Income income = mock(Income.class);
    when(income.getId()).thenReturn(1L);
    when(income.getValue()).thenReturn(new BigDecimal("1000.00"));

    IncomeLabel label = mock(IncomeLabel.class);
    IncomeCategory category = mock(IncomeCategory.class);

    when(label.getName()).thenReturn("Salary");
    when(category.getName()).thenReturn("Income");
    when(label.getCategory()).thenReturn(category);
    when(income.getLabel()).thenReturn(label);

    when(income.getOccurrenceDate()).thenReturn(LocalDate.of(2025, 5, 1));

    when(incomeService.getIncomeById(1L)).thenReturn(income);

    mockMvc
        .perform(get("/api/incomes/1").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1L))
        .andExpect(jsonPath("$.value").value(1000.00))
        .andExpect(jsonPath("$.labelName").value("Salary"))
        .andExpect(jsonPath("$.categoryName").value("Income"))
        .andExpect(jsonPath("$.occurrenceDate").value("2025-05-01"));
  }

  @WithMockUser
  @Test
  void testCreateIncome_returnsCreatedIncome() throws Exception {
    IncomeInsertRequest request = new IncomeInsertRequest();
    request.setValue(new BigDecimal("1200.00"));
    request.setOccurrenceDate(LocalDate.of(2025, 5, 1));

    Income income = new Income();
    income.setId(10L);
    income.setValue(request.getValue());
    income.setOccurrenceDate(request.getOccurrenceDate());
    income.setLabelId(2L);

    when(incomeService.createIncome(eq(1L), eq(2L), any(IncomeInsertRequest.class)))
        .thenReturn(income);

    mockMvc
        .perform(
            post("/api/incomes/user/1/label/2")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(10L))
        .andExpect(jsonPath("$.value").value(1200.00))
        .andExpect(jsonPath("$.occurrenceDate").value("2025-05-01"))
        .andExpect(jsonPath("$.labelId").value(2L));
  }

  @WithMockUser
  @Test
  void testDeleteIncome_returnsNoContent() throws Exception {
    doNothing().when(incomeService).deleteIncome(1L);

    mockMvc.perform(delete("/api/incomes/1").with(csrf())).andExpect(status().isNoContent());

    verify(incomeService, times(1)).deleteIncome(1L);
  }

  @WithMockUser
  @Test
  void testUpdateIncome_returnsUpdatedRequest() throws Exception {
    IncomeUpdateRequest updateRequest = new IncomeUpdateRequest();
    updateRequest.setValue(new BigDecimal("1300.00"));
    updateRequest.setOccurrenceDate(LocalDate.of(2025, 6, 1));

    Income updatedIncome = mock(Income.class);
    when(updatedIncome.getId()).thenReturn(1L);
    when(updatedIncome.getValue()).thenReturn(updateRequest.getValue());
    when(updatedIncome.getOccurrenceDate()).thenReturn(updateRequest.getOccurrenceDate());

    IncomeLabel label = mock(IncomeLabel.class);
    IncomeCategory category = mock(IncomeCategory.class);
    when(label.getName()).thenReturn("Bonus");
    when(category.getName()).thenReturn("Income");
    when(label.getCategory()).thenReturn(category);
    when(updatedIncome.getLabel()).thenReturn(label);

    when(incomeService.updateIncome(eq(1L), any(IncomeUpdateRequest.class)))
        .thenReturn(updatedIncome);

    mockMvc
        .perform(
            put("/api/incomes/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.value").value(1300.00))
        .andExpect(jsonPath("$.occurrenceDate").value("2025-06-01"));
  }
}
