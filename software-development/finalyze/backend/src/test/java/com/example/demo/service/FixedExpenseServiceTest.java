package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.FixedExpense;
import com.example.demo.repository.FixedExpenseRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class FixedExpenseServiceTest {

  private FixedExpenseRepository repository;
  private FixedExpenseService service;

  @BeforeEach
  void setUp() {
    repository = mock(FixedExpenseRepository.class);
    service = new FixedExpenseService(repository);
  }

  @Test
  void testGetAllFixedExpenses_returnsList() {
    List<FixedExpense> expenses = List.of(new FixedExpense(), new FixedExpense());
    when(repository.findAll()).thenReturn(expenses);

    List<FixedExpense> result = service.getAllFixedExpenses();

    assertEquals(2, result.size());
    verify(repository).findAll();
  }

  @Test
  void testGetFixedExpenseById_found() {
    FixedExpense expense = new FixedExpense();
    when(repository.findById(1L)).thenReturn(Optional.of(expense));

    Optional<FixedExpense> result = service.getFixedExpenseById(1L);

    assertTrue(result.isPresent());
    assertEquals(expense, result.get());
    verify(repository).findById(1L);
  }

  @Test
  void testGetFixedExpenseById_notFound() {
    when(repository.findById(1L)).thenReturn(Optional.empty());

    Optional<FixedExpense> result = service.getFixedExpenseById(1L);

    assertFalse(result.isPresent());
    verify(repository).findById(1L);
  }

  @Test
  void testSaveFixedExpense_savesAndReturns() {
    FixedExpense expense = new FixedExpense();
    when(repository.save(expense)).thenReturn(expense);

    FixedExpense result = service.saveFixedExpense(expense);

    assertEquals(expense, result);
    verify(repository).save(expense);
  }

  @Test
  void testDeleteFixedExpense_callsDeleteById() {
    service.deleteFixedExpense(42L);
    verify(repository).deleteById(42L);
  }

  @Test
  void testGetFixedExpensesByUserId_returnsList() {
    List<FixedExpense> expenses = List.of(new FixedExpense());
    when(repository.findByUserId(99L)).thenReturn(expenses);

    List<FixedExpense> result = service.getFixedExpensesByUserId(99L);

    assertEquals(1, result.size());
    verify(repository).findByUserId(99L);
  }
}
