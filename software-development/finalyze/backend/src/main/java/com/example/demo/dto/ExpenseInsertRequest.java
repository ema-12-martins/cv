package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseInsertRequest {
  private BigDecimal value;
  private LocalDate occurrenceDate;

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
}
