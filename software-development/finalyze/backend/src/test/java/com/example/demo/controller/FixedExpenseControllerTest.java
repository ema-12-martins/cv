package com.example.demo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.enums.Frequency;
import com.example.demo.model.FixedExpense;
import com.example.demo.service.FixedExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(FixedExpenseController.class)
@AutoConfigureMockMvc(addFilters = false)
public class FixedExpenseControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private FixedExpenseService fixedExpenseService;

  @Autowired private ObjectMapper objectMapper;

  private FixedExpense sampleExpense;

  @BeforeEach
  public void setup() {
    sampleExpense = new FixedExpense();
    sampleExpense.setId(1L);
    sampleExpense.setUserId(100L);
    sampleExpense.setLabelId(200L);
    sampleExpense.setValue(new BigDecimal("123.45"));
    sampleExpense.setStartDate(LocalDate.of(2023, 1, 1));
    sampleExpense.setInsertionDate(LocalDate.of(2023, 1, 10));
    sampleExpense.setFrequency(Frequency.MONTHLY);
  }

  @Test
  public void testGetAllFixedExpenses_returnsList() throws Exception {
    when(fixedExpenseService.getAllFixedExpenses()).thenReturn(List.of(sampleExpense));

    mockMvc
        .perform(get("/api/fixed_expenses"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].id").value(1));
  }

  @Test
  public void testGetFixedExpenseById_found_returnsExpense() throws Exception {
    when(fixedExpenseService.getFixedExpenseById(1L)).thenReturn(Optional.of(sampleExpense));

    mockMvc
        .perform(get("/api/fixed_expenses/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  public void testGetFixedExpenseById_notFound_returns404() throws Exception {
    when(fixedExpenseService.getFixedExpenseById(999L)).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/fixed_expenses/999")).andExpect(status().isNotFound());
  }

  @Test
  public void testGetFixedExpensesByUserId_returnsList() throws Exception {
    when(fixedExpenseService.getFixedExpensesByUserId(100L)).thenReturn(List.of(sampleExpense));

    mockMvc
        .perform(get("/api/fixed_expenses/user/100"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].userId").value(100));
  }

  @Test
  public void testCreateFixedExpense_returnsCreatedExpense() throws Exception {
    when(fixedExpenseService.saveFixedExpense(any(FixedExpense.class))).thenReturn(sampleExpense);

    mockMvc
        .perform(
            post("/api/fixed_expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleExpense)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.value").value(123.45));
  }

  @Test
  public void testUpdateFixedExpense_found_returnsUpdatedExpense() throws Exception {
    when(fixedExpenseService.getFixedExpenseById(1L)).thenReturn(Optional.of(sampleExpense));
    when(fixedExpenseService.saveFixedExpense(any(FixedExpense.class))).thenReturn(sampleExpense);

    mockMvc
        .perform(
            put("/api/fixed_expenses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleExpense)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  public void testUpdateFixedExpense_notFound_returns404() throws Exception {
    when(fixedExpenseService.getFixedExpenseById(999L)).thenReturn(Optional.empty());

    mockMvc
        .perform(
            put("/api/fixed_expenses/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleExpense)))
        .andExpect(status().isNotFound());
  }

  @Test
  public void testDeleteFixedExpense_found_returnsNoContent() throws Exception {
    when(fixedExpenseService.getFixedExpenseById(1L)).thenReturn(Optional.of(sampleExpense));
    doNothing().when(fixedExpenseService).deleteFixedExpense(1L);

    mockMvc.perform(delete("/api/fixed_expenses/1")).andExpect(status().isNoContent());
  }

  @Test
  public void testDeleteFixedExpense_notFound_returns404() throws Exception {
    when(fixedExpenseService.getFixedExpenseById(999L)).thenReturn(Optional.empty());

    mockMvc.perform(delete("/api/fixed_expenses/999")).andExpect(status().isNotFound());
  }
}
