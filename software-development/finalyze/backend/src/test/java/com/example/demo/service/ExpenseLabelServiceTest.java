package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.ExpenseLabel;
import com.example.demo.repository.ExpenseLabelRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExpenseLabelServiceTest {

  private ExpenseLabelRepository mockRepository;
  private ExpenseLabelService service;

  @BeforeEach
  void setUp() {
    mockRepository = mock(ExpenseLabelRepository.class);
    service = new ExpenseLabelService(mockRepository);
  }

  @Test
  void getAllLabels_returnsList() {
    List<ExpenseLabel> labels = List.of(new ExpenseLabel(), new ExpenseLabel());
    when(mockRepository.findAll()).thenReturn(labels);

    List<ExpenseLabel> result = service.getAllLabels();

    assertEquals(2, result.size());
    verify(mockRepository).findAll();
  }

  @Test
  void getLabelById_whenFound_returnsLabel() {
    ExpenseLabel label = new ExpenseLabel();
    label.setId(1L);
    when(mockRepository.findById(1L)).thenReturn(Optional.of(label));

    Optional<ExpenseLabel> result = service.getLabelById(1L);

    assertTrue(result.isPresent());
    assertEquals(1L, result.get().getId());
    verify(mockRepository).findById(1L);
  }

  @Test
  void getLabelById_whenNotFound_returnsEmpty() {
    when(mockRepository.findById(100L)).thenReturn(Optional.empty());

    Optional<ExpenseLabel> result = service.getLabelById(100L);

    assertFalse(result.isPresent());
    verify(mockRepository).findById(100L);
  }

  @Test
  void saveLabel_returnsSavedLabel() {
    ExpenseLabel label = new ExpenseLabel();
    label.setName("Transport");
    when(mockRepository.save(label)).thenReturn(label);

    ExpenseLabel result = service.saveLabel(label);

    assertEquals("Transport", result.getName());
    verify(mockRepository).save(label);
  }

  @Test
  void deleteLabel_callsRepositoryDelete() {
    service.deleteLabel(55L);

    verify(mockRepository).deleteById(55L);
  }

  @Test
  void getLabelsByUserIdAndCategoryId_returnsLabels() {
    ExpenseLabel label = new ExpenseLabel();
    label.setName("Food");
    when(mockRepository.findByUserIdAndCategoryId(1L, 2L)).thenReturn(List.of(label));

    List<ExpenseLabel> result = service.getLabelsByUserIdAndCategoryId(1L, 2L);

    assertEquals(1, result.size());
    assertEquals("Food", result.get(0).getName());
    verify(mockRepository).findByUserIdAndCategoryId(1L, 2L);
  }
}
