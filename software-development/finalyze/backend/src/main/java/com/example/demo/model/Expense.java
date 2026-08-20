package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expense")
public class Expense {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "label_id")
  private Long labelId;

  @Column(name = "user_id")
  private Long userId;

  @Column(name = "value")
  private BigDecimal value;

  @Column(name = "occurrence_date")
  private LocalDate occurrenceDate;

  @Column(name = "insertion_date")
  private LocalDate insertionDate;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "label_id", insertable = false, updatable = false)
  private ExpenseLabel label;

  // Getters and Setters

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getLabelId() {
    return labelId;
  }

  public void setLabelId(Long labelId) {
    this.labelId = labelId;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public BigDecimal getValue() {
    return value;
  }

  public void setValue(BigDecimal value) {
    this.value = value;
  }

  public LocalDate getOccurrenceDate() {
    return occurrenceDate;
  }

  public void setOccurrenceDate(LocalDate occurrenceDate) {
    this.occurrenceDate = occurrenceDate;
  }

  public LocalDate getInsertionDate() {
    return insertionDate;
  }

  public void setInsertionDate(LocalDate insertionDate) {
    this.insertionDate = insertionDate;
  }

  public ExpenseLabel getLabel() {
    return label;
  }
}
