package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "gamification")
public class Gamification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false, unique = true)
  private Long userId;

  private Long level;

  @Column(name = "exp_points")
  private Long expPoints;

  @Column(name = "consecutive_income")
  private Long consecutiveIncome;

  @Column(name = "last_income")
  private LocalDate lastIncome;

  @Column(name = "consecutive_dispense")
  private Long consecutiveDispense;

  @Column(name = "last_dispense")
  private LocalDate lastDispense;

  @Column(name = "last_login")
  private LocalDate lastLogin;

  @Column(name = "consecutive_login")
  private Long consecutiveLogin;

  // Getters e Setters

  public Long getConsecutiveLogin() {
    return consecutiveLogin;
  }

  public void setConsecutiveLogin(Long consecutiveLogin) {
    this.consecutiveLogin = consecutiveLogin;
  }

  public LocalDate getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(LocalDate lastLogin) {
    this.lastLogin = lastLogin;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Long getLevel() {
    return level;
  }

  public void setLevel(Long level) {
    this.level = level;
  }

  public Long getExpPoints() {
    return expPoints;
  }

  public void setExpPoints(Long expPoints) {
    this.expPoints = expPoints;
  }

  public Long getConsecutiveIncome() {
    return consecutiveIncome;
  }

  public void setConsecutiveIncome(Long consecutiveIncome) {
    this.consecutiveIncome = consecutiveIncome;
  }

  public LocalDate getLastIncome() {
    return lastIncome;
  }

  public void setLastIncome(LocalDate lastIncome) {
    this.lastIncome = lastIncome;
  }

  public Long getConsecutiveDispense() {
    return consecutiveDispense;
  }

  public void setConsecutiveDispense(Long consecutiveDispense) {
    this.consecutiveDispense = consecutiveDispense;
  }

  public LocalDate getLastDispense() {
    return lastDispense;
  }

  public void setLastDispense(LocalDate lastDispense) {
    this.lastDispense = lastDispense;
  }
}
