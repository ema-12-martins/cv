package com.example.demo.controller;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.model.FixedIncome;
import com.example.demo.model.FixedIncome.FrequencyEnum;
import com.example.demo.service.FixedIncomeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(FixedIncomeController.class)
class FixedIncomeControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private FixedIncomeService fixedIncomeService;

  @Autowired private ObjectMapper objectMapper;

  private FixedIncome getSampleIncome(Long id) {
    FixedIncome income = new FixedIncome();
    income.setId(id);
    income.setUserId(1L);
    income.setLabelId(2L);
    income.setValue(BigDecimal.valueOf(1500));
    income.setStartDate(LocalDate.of(2023, 1, 1));
    income.setFrequency(FrequencyEnum.MONTHLY);
    income.setInsertionDate(LocalDate.of(2023, 1, 1));
    return income;
  }

  @WithMockUser
  @Test
  void testGetAllFixedIncomes() throws Exception {
    List<FixedIncome> incomes = Arrays.asList(getSampleIncome(1L), getSampleIncome(2L));
    when(fixedIncomeService.getAllFixedIncomes()).thenReturn(incomes);

    mockMvc
        .perform(get("/api/fixed_incomes"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2));
  }

  @WithMockUser
  @Test
  void testGetFixedIncomesByUserId() throws Exception {
    List<FixedIncome> incomes = List.of(getSampleIncome(1L));
    when(fixedIncomeService.getFixedIncomesByUserId(1L)).thenReturn(incomes);

    mockMvc
        .perform(get("/api/fixed_incomes/user/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1));
  }

  @WithMockUser
  @Test
  void testGetFixedIncomeById_found() throws Exception {
    FixedIncome income = getSampleIncome(1L);
    when(fixedIncomeService.getFixedIncomeById(1L)).thenReturn(Optional.of(income));

    mockMvc
        .perform(get("/api/fixed_incomes/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @WithMockUser
  @Test
  void testGetFixedIncomeById_notFound() throws Exception {
    when(fixedIncomeService.getFixedIncomeById(1L)).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/fixed_incomes/1")).andExpect(status().isNotFound());
  }

  @WithMockUser
  @Test
  void testCreateFixedIncome() throws Exception {
    FixedIncome request = getSampleIncome(null);
    FixedIncome saved = getSampleIncome(1L);
    when(fixedIncomeService.saveFixedIncome(any(FixedIncome.class))).thenReturn(saved);

    mockMvc
        .perform(
            post("/api/fixed_incomes")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @WithMockUser
  @Test
  void testUpdateFixedIncome_found() throws Exception {
    FixedIncome request = getSampleIncome(null);
    FixedIncome saved = getSampleIncome(1L);
    when(fixedIncomeService.getFixedIncomeById(1L)).thenReturn(Optional.of(getSampleIncome(1L)));
    when(fixedIncomeService.saveFixedIncome(any(FixedIncome.class))).thenReturn(saved);

    mockMvc
        .perform(
            put("/api/fixed_incomes/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @WithMockUser
  @Test
  void testUpdateFixedIncome_notFound() throws Exception {
    when(fixedIncomeService.getFixedIncomeById(1L)).thenReturn(Optional.empty());

    mockMvc
        .perform(
            put("/api/fixed_incomes/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(getSampleIncome(null))))
        .andExpect(status().isNotFound());
  }

  @WithMockUser
  @Test
  void testDeleteFixedIncome_found() throws Exception {
    when(fixedIncomeService.getFixedIncomeById(1L)).thenReturn(Optional.of(getSampleIncome(1L)));
    doNothing().when(fixedIncomeService).deleteFixedIncome(1L);

    mockMvc.perform(delete("/api/fixed_incomes/1").with(csrf())).andExpect(status().isNoContent());
  }

  @WithMockUser
  @Test
  void testDeleteFixedIncome_notFound() throws Exception {
    when(fixedIncomeService.getFixedIncomeById(1L)).thenReturn(Optional.empty());

    mockMvc.perform(delete("/api/fixed_incomes/1").with(csrf())).andExpect(status().isNotFound());
  }
}
