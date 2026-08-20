package com.example.demo.service;

import com.example.demo.model.Gamification;
import com.example.demo.repository.GamificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GamificationService {

  private final GamificationRepository gamificationRepository;

  @Autowired
  public GamificationService(GamificationRepository gamificationRepository) {
    this.gamificationRepository = gamificationRepository;
  }

  public Gamification getGamificationForUser(Long userId) {
    return gamificationRepository
        .findByUserId(userId)
        .orElseGet(
            () -> {
              // Create a new gamification record if it doesn't exist
              Gamification newGamification = new Gamification();
              newGamification.setUserId(userId);
              newGamification.setLevel(1L);
              newGamification.setExpPoints(0L);
              newGamification.setConsecutiveIncome(0L);
              newGamification.setConsecutiveDispense(0L);
              newGamification.setConsecutiveLogin(0L);
              return gamificationRepository.save(newGamification);
            });
  }

  public Gamification updateExpPoints(Long userId, int deltaPoints) {
    Gamification gamification =
        gamificationRepository
            .findByUserId(userId)
            .orElseGet(
                () -> {
                  Gamification newG = new Gamification();
                  newG.setUserId(userId);
                  newG.setLevel(1L);
                  newG.setExpPoints(0L);
                  newG.setConsecutiveIncome(0L);
                  newG.setConsecutiveDispense(0L);
                  return newG;
                });

    long currentPoints = gamification.getExpPoints() != null ? gamification.getExpPoints() : 0L;
    long updatedPoints = currentPoints + deltaPoints;
    gamification.setExpPoints(updatedPoints);

    return gamificationRepository.save(gamification);
  }

  public void addExpPoints(Long userId, int points) {
    Gamification gamification =
        gamificationRepository
            .findByUserId(userId)
            .orElseGet(
                () -> {
                  Gamification newG = new Gamification();
                  newG.setUserId(userId);
                  newG.setLevel(1L);
                  newG.setExpPoints(0L);
                  newG.setConsecutiveIncome(0L);
                  newG.setConsecutiveDispense(0L);
                  return newG;
                });

    gamification.setExpPoints(gamification.getExpPoints() + points);
    gamificationRepository.save(gamification);
  }

  public int getUserPoints(Long userId) {
    return gamificationRepository
        .findByUserId(userId)
        .map(g -> g.getExpPoints().intValue())
        .orElse(0);
  }
}
