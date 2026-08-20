package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class GamificationTest {

  @Test
  void testGettersAndSetters() {
    Gamification gamification = new Gamification();

    Long id = 1L;
    Long userId = 42L;
    Long level = 3L;
    Long expPoints = 1200L;
    Long consecutiveIncome = 4L;
    LocalDate lastIncome = LocalDate.of(2024, 12, 1);
    Long consecutiveDispense = 2L;
    LocalDate lastDispense = LocalDate.of(2024, 12, 2);
    LocalDate lastLogin = LocalDate.of(2024, 12, 3);
    Long consecutiveLogin = 5L;

    gamification.setId(id);
    gamification.setUserId(userId);
    gamification.setLevel(level);
    gamification.setExpPoints(expPoints);
    gamification.setConsecutiveIncome(consecutiveIncome);
    gamification.setLastIncome(lastIncome);
    gamification.setConsecutiveDispense(consecutiveDispense);
    gamification.setLastDispense(lastDispense);
    gamification.setLastLogin(lastLogin);
    gamification.setConsecutiveLogin(consecutiveLogin);

    assertEquals(id, gamification.getId());
    assertEquals(userId, gamification.getUserId());
    assertEquals(level, gamification.getLevel());
    assertEquals(expPoints, gamification.getExpPoints());
    assertEquals(consecutiveIncome, gamification.getConsecutiveIncome());
    assertEquals(lastIncome, gamification.getLastIncome());
    assertEquals(consecutiveDispense, gamification.getConsecutiveDispense());
    assertEquals(lastDispense, gamification.getLastDispense());
    assertEquals(lastLogin, gamification.getLastLogin());
    assertEquals(consecutiveLogin, gamification.getConsecutiveLogin());
  }
}
