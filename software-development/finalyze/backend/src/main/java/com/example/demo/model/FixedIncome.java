package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fixed_income")
public class FixedIncome {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long userId;

  private Long labelId;

  private BigDecimal value;

  private LocalDate startDate;

  @Enumerated(EnumType.STRING)
  private FrequencyEnum frequency;

  private LocalDate insertionDate;

  public enum FrequencyEnum {
    DAILY,
    WEEKLY,
    MONTHLY,
    YEARLY
  }

  // Getters
  public Long getId() {
    return id;
  }

  public Long getUserId() {
    return userId;
  }

  public Long getLabelId() {
    return labelId;
  }

  public BigDecimal getValue() {
    return value;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public FrequencyEnum getFrequency() {
    return frequency;
  }

  public LocalDate getInsertionDate() {
    return insertionDate;
  }

  // Setters
  public void setId(Long id) {
    this.id = id;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public void setLabelId(Long labelId) {
    this.labelId = labelId;
  }

  public void setValue(BigDecimal value) {
    this.value = value;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public void setFrequency(FrequencyEnum frequency) {
    this.frequency = frequency;
  }

  public void setInsertionDate(LocalDate insertionDate) {
    this.insertionDate = insertionDate;
  }
}
