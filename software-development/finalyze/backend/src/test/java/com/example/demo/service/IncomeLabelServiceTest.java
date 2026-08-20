package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.IncomeLabel;
import com.example.demo.repository.IncomeLabelRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class IncomeLabelServiceTest {

  private IncomeLabelRepository repository;
  private IncomeLabelService service;

  @BeforeEach
  void setUp() {
    repository = mock(IncomeLabelRepository.class);
    service = new IncomeLabelService(repository);
  }

  @Test
  void testGetLabelsByUserIdAndCategoryId_returnsLabels() {
    IncomeLabel label1 = new IncomeLabel();
    IncomeLabel label2 = new IncomeLabel();
    List<IncomeLabel> labels = List.of(label1, label2);

    when(repository.findByUserIdAndCategoryId(1L, 2L)).thenReturn(labels);

    List<IncomeLabel> result = service.getLabelsByUserIdAndCategoryId(1L, 2L);

    assertEquals(2, result.size());
    assertTrue(result.contains(label1));
    assertTrue(result.contains(label2));
    verify(repository).findByUserIdAndCategoryId(1L, 2L);
  }

  @Test
  void testGetLabelsByUserIdAndCategoryId_returnsEmptyList() {
    when(repository.findByUserIdAndCategoryId(99L, 88L)).thenReturn(List.of());

    List<IncomeLabel> result = service.getLabelsByUserIdAndCategoryId(99L, 88L);

    assertTrue(result.isEmpty());
    verify(repository).findByUserIdAndCategoryId(99L, 88L);
  }
}
