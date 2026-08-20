package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class IncomeResponse {
  private Long id;
  private BigDecimal value;
  private String labelName;
  private String categoryName;
  private LocalDate occurrenceDate;

  public IncomeResponse(
      Long id, BigDecimal value, String labelName, String categoryName, LocalDate occurrenceDate) {
    this.id = id;
    this.value = value;
    this.labelName = labelName;
    this.categoryName = categoryName;
    this.occurrenceDate = occurrenceDate;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public BigDecimal getValue() {
    return value;
  }

  public void setValue(BigDecimal value) {
    this.value = value;
  }

  public String getLabelName() {
    return labelName;
  }

  public void setLabelName(String labelName) {
    this.labelName = labelName;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
  }

  public LocalDate getOccurrenceDate() {
    return occurrenceDate;
  }

  public void setOccurrenceDate(LocalDate occurrenceDate) {
    this.occurrenceDate = occurrenceDate;
  }
}
