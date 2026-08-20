package com.example.demo.model;

import com.example.demo.enums.Frequency;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fixed_expense")
public class FixedExpense {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "label_id", nullable = false)
  private Long labelId;

  @Column(nullable = false)
  private BigDecimal value;

  @Column(name = "start_date", nullable = false)
  private LocalDate startDate;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Frequency frequency;

  @Column(name = "insertion_date", nullable = false)
  private LocalDate insertionDate;

  // Getters & Setters
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

  public Long getLabelId() {
    return labelId;
  }

  public void setLabelId(Long labelId) {
    this.labelId = labelId;
  }

  public BigDecimal getValue() {
    return value;
  }

  public void setValue(BigDecimal value) {
    this.value = value;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public Frequency getFrequency() {
    return frequency;
  }

  public void setFrequency(Frequency frequency) {
    this.frequency = frequency;
  }

  public LocalDate getInsertionDate() {
    return insertionDate;
  }

  public void setInsertionDate(LocalDate insertionDate) {
    this.insertionDate = insertionDate;
  }
}
