package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.ExpenseTarget;
import com.example.demo.model.ExpenseTarget.ExpenseTargetId;
import com.example.demo.repository.ExpenseTargetRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ExpenseTargetServiceTest {

  private ExpenseTargetRepository repository;
  private ExpenseTargetService service;

  @BeforeEach
  void setUp() {
    repository = mock(ExpenseTargetRepository.class);
    service = new ExpenseTargetService(repository);
  }

  @Test
  void testGetAll_returnsList() {
    List<ExpenseTarget> targets = List.of(new ExpenseTarget(), new ExpenseTarget());
    when(repository.findAll()).thenReturn(targets);

    List<ExpenseTarget> result = service.getAll();

    assertEquals(2, result.size());
    verify(repository).findAll();
  }

  @Test
  void testGetById_whenPresent_returnsTarget() {
    ExpenseTarget target = new ExpenseTarget();
    ExpenseTargetId id = new ExpenseTargetId(1L, 2L);
    when(repository.findById(id)).thenReturn(Optional.of(target));

    Optional<ExpenseTarget> result = service.getById(1L, 2L);

    assertTrue(result.isPresent());
    assertEquals(target, result.get());
    verify(repository).findById(id);
  }

  @Test
  void testGetById_whenNotPresent_returnsEmpty() {
    ExpenseTargetId id = new ExpenseTargetId(1L, 2L);
    when(repository.findById(id)).thenReturn(Optional.empty());

    Optional<ExpenseTarget> result = service.getById(1L, 2L);

    assertFalse(result.isPresent());
    verify(repository).findById(id);
  }

  @Test
  void testSave_returnsSavedTarget() {
    ExpenseTarget target = new ExpenseTarget();
    when(repository.save(target)).thenReturn(target);

    ExpenseTarget result = service.save(target);

    assertEquals(target, result);
    verify(repository).save(target);
  }

  @Test
  void testDelete_callsRepositoryDeleteById() {
    ExpenseTargetId id = new ExpenseTargetId(3L, 4L);

    service.delete(3L, 4L);

    verify(repository).deleteById(id);
  }
}
