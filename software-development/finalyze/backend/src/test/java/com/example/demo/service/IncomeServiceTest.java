package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.dto.IncomeInsertRequest;
import com.example.demo.dto.IncomeUpdateRequest;
import com.example.demo.model.Income;
import com.example.demo.repository.IncomeRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class IncomeServiceTest {

  private IncomeRepository incomeRepository;
  private GamificationService gamificationService;
  private IncomeService incomeService;

  @BeforeEach
  void setUp() {
    incomeRepository = mock(IncomeRepository.class);
    gamificationService = mock(GamificationService.class);
    incomeService = new IncomeService(incomeRepository, gamificationService);
  }

  @Test
  void testGetTotalIncomeByUserId_returnsTotal() {
    when(incomeRepository.sumIncomesByUserId(1L)).thenReturn(new BigDecimal("500.00"));

    BigDecimal total = incomeService.getTotalIncomeByUserId(1L);

    assertEquals(new BigDecimal("500.00"), total);
    verify(incomeRepository).sumIncomesByUserId(1L);
  }

  @Test
  void testGetTotalIncomeByUserId_returnsZeroWhenNull() {
    when(incomeRepository.sumIncomesByUserId(2L)).thenReturn(null);

    BigDecimal total = incomeService.getTotalIncomeByUserId(2L);

    assertEquals(BigDecimal.ZERO, total);
  }

  @Test
  void testGetIncomeById_found() {
    Income income = new Income();
    income.setId(1L);

    when(incomeRepository.findById(1L)).thenReturn(Optional.of(income));

    Income result = incomeService.getIncomeById(1L);

    assertEquals(1L, result.getId());
  }

  @Test
  void testGetIncomeById_notFound() {
    when(incomeRepository.findById(999L)).thenReturn(Optional.empty());

    RuntimeException ex =
        assertThrows(
            RuntimeException.class,
            () -> {
              incomeService.getIncomeById(999L);
            });

    assertEquals("Income not found with id: 999", ex.getMessage());
  }

  @Test
  void testCreateIncome_savesIncomeAndAddsPoints() {
    IncomeInsertRequest req = new IncomeInsertRequest();
    req.setValue(new BigDecimal("250.00"));
    req.setOccurrenceDate(LocalDate.of(2025, 6, 1));

    Income savedIncome = new Income();
    savedIncome.setUserId(1L);
    savedIncome.setLabelId(2L);
    savedIncome.setValue(req.getValue());
    savedIncome.setOccurrenceDate(req.getOccurrenceDate());
    savedIncome.setInsertionDate(LocalDate.now());

    when(incomeRepository.save(any(Income.class))).thenReturn(savedIncome);

    Income result = incomeService.createIncome(1L, 2L, req);

    assertEquals(new BigDecimal("250.00"), result.getValue());
    assertEquals(1L, result.getUserId());
    assertEquals(2L, result.getLabelId());
    assertNotNull(result.getInsertionDate());

    verify(incomeRepository).save(any(Income.class));
    verify(gamificationService).addExpPoints(1L, 5);
  }

  @Test
  void testDeleteIncome_found() {
    when(incomeRepository.existsById(1L)).thenReturn(true);

    incomeService.deleteIncome(1L);

    verify(incomeRepository).deleteById(1L);
  }

  @Test
  void testDeleteIncome_notFound() {
    when(incomeRepository.existsById(2L)).thenReturn(false);

    EntityNotFoundException ex =
        assertThrows(
            EntityNotFoundException.class,
            () -> {
              incomeService.deleteIncome(2L);
            });

    assertEquals("Income not found with id: 2", ex.getMessage());
  }

  @Test
  void testUpdateIncome_foundAndUpdated() {
    Income income = new Income();
    income.setId(1L);
    income.setValue(new BigDecimal("100"));
    income.setOccurrenceDate(LocalDate.of(2024, 1, 1));
    income.setLabelId(1L);

    IncomeUpdateRequest req = new IncomeUpdateRequest();
    req.setValue(new BigDecimal("300"));
    req.setOccurrenceDate(LocalDate.of(2024, 12, 1));
    req.setLabel(5L);

    when(incomeRepository.findById(1L)).thenReturn(Optional.of(income));
    when(incomeRepository.save(any(Income.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    Income result = incomeService.updateIncome(1L, req);

    assertEquals(new BigDecimal("300"), result.getValue());
    assertEquals(LocalDate.of(2024, 12, 1), result.getOccurrenceDate());
    assertEquals(5L, result.getLabelId());
  }

  @Test
  void testUpdateIncome_notFound() {
    when(incomeRepository.findById(10L)).thenReturn(Optional.empty());

    RuntimeException ex =
        assertThrows(
            RuntimeException.class,
            () -> {
              incomeService.updateIncome(10L, new IncomeUpdateRequest());
            });

    assertEquals("Income not found", ex.getMessage());
  }
}
