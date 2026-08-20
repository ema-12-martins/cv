package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.Gamification;
import com.example.demo.repository.GamificationRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class GamificationServiceTest {

  private GamificationRepository gamificationRepository;
  private GamificationService gamificationService;

  @BeforeEach
  void setUp() {
    gamificationRepository = mock(GamificationRepository.class);
    gamificationService = new GamificationService(gamificationRepository);
  }

  @Test
  void getGamificationForUser_returnsExistingGamification() {
    Gamification existing = new Gamification();
    existing.setUserId(1L);
    when(gamificationRepository.findByUserId(1L)).thenReturn(Optional.of(existing));

    Gamification result = gamificationService.getGamificationForUser(1L);

    assertEquals(1L, result.getUserId());
    verify(gamificationRepository, never()).save(any());
  }

  @Test
  void getGamificationForUser_createsNewIfNotExist() {
    when(gamificationRepository.findByUserId(2L)).thenReturn(Optional.empty());

    ArgumentCaptor<Gamification> captor = ArgumentCaptor.forClass(Gamification.class);
    when(gamificationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    Gamification result = gamificationService.getGamificationForUser(2L);

    verify(gamificationRepository).save(captor.capture());
    assertEquals(2L, result.getUserId());
    assertEquals(1L, result.getLevel());
    assertEquals(0L, result.getExpPoints());
    assertEquals(0L, result.getConsecutiveIncome());
    assertEquals(0L, result.getConsecutiveDispense());
    assertEquals(0L, result.getConsecutiveLogin());
  }

  @Test
  void updateExpPoints_withExistingGamification() {
    Gamification g = new Gamification();
    g.setUserId(3L);
    g.setExpPoints(10L);
    when(gamificationRepository.findByUserId(3L)).thenReturn(Optional.of(g));
    when(gamificationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

    Gamification result = gamificationService.updateExpPoints(3L, 5);

    assertEquals(15L, result.getExpPoints());
  }

  @Test
  void updateExpPoints_withNullExpPoints() {
    Gamification g = new Gamification();
    g.setUserId(4L);
    g.setExpPoints(null);
    when(gamificationRepository.findByUserId(4L)).thenReturn(Optional.of(g));
    when(gamificationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

    Gamification result = gamificationService.updateExpPoints(4L, 7);

    assertEquals(7L, result.getExpPoints());
  }

  @Test
  void updateExpPoints_createsNewIfNotExist() {
    when(gamificationRepository.findByUserId(5L)).thenReturn(Optional.empty());
    when(gamificationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

    Gamification result = gamificationService.updateExpPoints(5L, 10);

    assertEquals(10L, result.getExpPoints());
    assertEquals(5L, result.getUserId());
  }

  @Test
  void addExpPoints_withExistingGamification() {
    Gamification g = new Gamification();
    g.setUserId(6L);
    g.setExpPoints(20L);
    when(gamificationRepository.findByUserId(6L)).thenReturn(Optional.of(g));

    gamificationService.addExpPoints(6L, 5);

    assertEquals(25L, g.getExpPoints());
    verify(gamificationRepository).save(g);
  }

  @Test
  void addExpPoints_createsNewIfNotExist() {
    when(gamificationRepository.findByUserId(7L)).thenReturn(Optional.empty());

    gamificationService.addExpPoints(7L, 8);

    verify(gamificationRepository)
        .save(argThat(g -> g.getUserId().equals(7L) && g.getExpPoints().equals(8L)));
  }

  @Test
  void getUserPoints_withExistingGamification() {
    Gamification g = new Gamification();
    g.setExpPoints(33L);
    when(gamificationRepository.findByUserId(8L)).thenReturn(Optional.of(g));

    int points = gamificationService.getUserPoints(8L);

    assertEquals(33, points);
  }

  @Test
  void getUserPoints_returnsZeroIfNotExist() {
    when(gamificationRepository.findByUserId(9L)).thenReturn(Optional.empty());

    int points = gamificationService.getUserPoints(9L);

    assertEquals(0, points);
  }
}
