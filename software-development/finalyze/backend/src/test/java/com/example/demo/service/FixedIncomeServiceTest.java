package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.FixedIncome;
import com.example.demo.repository.FixedIncomeRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FixedIncomeServiceTest {

  private FixedIncomeRepository fixedIncomeRepository;
  private GamificationService gamificationService;
  private FixedIncomeService fixedIncomeService;

  @BeforeEach
  void setUp() {
    fixedIncomeRepository = mock(FixedIncomeRepository.class);
    gamificationService = mock(GamificationService.class);
    fixedIncomeService = new FixedIncomeService(fixedIncomeRepository, gamificationService);
  }

  @Test
  void getAllFixedIncomes_returnsAll() {
    FixedIncome income1 = new FixedIncome();
    FixedIncome income2 = new FixedIncome();
    when(fixedIncomeRepository.findAll()).thenReturn(Arrays.asList(income1, income2));

    List<FixedIncome> result = fixedIncomeService.getAllFixedIncomes();

    assertEquals(2, result.size());
    verify(fixedIncomeRepository).findAll();
  }

  @Test
  void getFixedIncomeById_returnsIncome() {
    FixedIncome income = new FixedIncome();
    when(fixedIncomeRepository.findById(1L)).thenReturn(Optional.of(income));

    Optional<FixedIncome> result = fixedIncomeService.getFixedIncomeById(1L);

    assertTrue(result.isPresent());
    assertEquals(income, result.get());
  }

  @Test
  void getFixedIncomeById_returnsEmpty() {
    when(fixedIncomeRepository.findById(99L)).thenReturn(Optional.empty());

    Optional<FixedIncome> result = fixedIncomeService.getFixedIncomeById(99L);

    assertFalse(result.isPresent());
  }

  @Test
  void saveFixedIncome_newIncome_setsDateAndGivesExp() {
    FixedIncome newIncome = new FixedIncome();
    newIncome.setUserId(10L);

    FixedIncome saved = new FixedIncome();
    saved.setUserId(10L);
    saved.setId(100L);

    when(fixedIncomeRepository.save(any())).thenReturn(saved);

    FixedIncome result = fixedIncomeService.saveFixedIncome(newIncome);

    assertNotNull(result);
    assertEquals(100L, result.getId());
    assertNotNull(newIncome.getInsertionDate());
    verify(gamificationService).addExpPoints(10L, 5);
  }

  @Test
  void saveFixedIncome_existingIncome_doesNotSetDateOrGiveExp() {
    FixedIncome existingIncome = new FixedIncome();
    existingIncome.setId(1L);
    existingIncome.setUserId(20L);

    when(fixedIncomeRepository.save(existingIncome)).thenReturn(existingIncome);

    FixedIncome result = fixedIncomeService.saveFixedIncome(existingIncome);

    assertEquals(1L, result.getId());
    assertNull(existingIncome.getInsertionDate());
    verify(gamificationService, never()).addExpPoints(anyLong(), anyInt());
  }

  @Test
  void deleteFixedIncome_callsRepositoryDelete() {
    fixedIncomeService.deleteFixedIncome(2L);
    verify(fixedIncomeRepository).deleteById(2L);
  }

  @Test
  void getFixedIncomesByUserId_returnsCorrectList() {
    FixedIncome income = new FixedIncome();
    income.setUserId(5L);
    when(fixedIncomeRepository.findByUserId(5L)).thenReturn(List.of(income));

    List<FixedIncome> result = fixedIncomeService.getFixedIncomesByUserId(5L);

    assertEquals(1, result.size());
    assertEquals(5L, result.get(0).getUserId());
    verify(fixedIncomeRepository).findByUserId(5L);
  }
}
