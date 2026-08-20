package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.SavingsTarget;
import com.example.demo.repository.SavingsTargetRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SavingsTargetServiceTest {

  private SavingsTargetRepository savingsTargetRepository;
  private SavingsTargetService savingsTargetService;

  @BeforeEach
  void setUp() {
    savingsTargetRepository = mock(SavingsTargetRepository.class);
    savingsTargetService = new SavingsTargetService(savingsTargetRepository);
  }

  @Test
  void testGetHighestPrioritySavingsTarget_found() {
    SavingsTarget target = new SavingsTarget();
    when(savingsTargetRepository.findHighestPriorityByUserId(1L)).thenReturn(Optional.of(target));

    Optional<SavingsTarget> result = savingsTargetService.getHighestPrioritySavingsTarget(1L);

    assertTrue(result.isPresent());
    assertEquals(target, result.get());
    verify(savingsTargetRepository).findHighestPriorityByUserId(1L);
  }

  @Test
  void testGetHighestPrioritySavingsTarget_notFound() {
    when(savingsTargetRepository.findHighestPriorityByUserId(1L)).thenReturn(Optional.empty());

    Optional<SavingsTarget> result = savingsTargetService.getHighestPrioritySavingsTarget(1L);

    assertFalse(result.isPresent());
  }

  @Test
  void testSaveSavingsTarget() {
    SavingsTarget target = new SavingsTarget();
    when(savingsTargetRepository.save(target)).thenReturn(target);

    SavingsTarget result = savingsTargetService.saveSavingsTarget(target);

    assertEquals(target, result);
    verify(savingsTargetRepository).save(target);
  }

  @Test
  void testCountSavingsTargets() {
    when(savingsTargetRepository.count()).thenReturn(3L);

    long count = savingsTargetService.countSavingsTargets();

    assertEquals(3L, count);
    verify(savingsTargetRepository).count();
  }

  @Test
  void testGetAllByUserId() {
    List<SavingsTarget> list = List.of(new SavingsTarget(), new SavingsTarget());
    when(savingsTargetRepository.findAllByUserId(2L)).thenReturn(list);

    List<SavingsTarget> result = savingsTargetService.getAllByUserId(2L);

    assertEquals(2, result.size());
    assertEquals(list, result);
  }

  @Test
  void testGetById_found() {
    SavingsTarget target = new SavingsTarget();
    when(savingsTargetRepository.findById(10L)).thenReturn(Optional.of(target));

    Optional<SavingsTarget> result = savingsTargetService.getById(10L);

    assertTrue(result.isPresent());
    assertEquals(target, result.get());
  }

  @Test
  void testGetById_notFound() {
    when(savingsTargetRepository.findById(99L)).thenReturn(Optional.empty());

    Optional<SavingsTarget> result = savingsTargetService.getById(99L);

    assertFalse(result.isPresent());
  }
}
