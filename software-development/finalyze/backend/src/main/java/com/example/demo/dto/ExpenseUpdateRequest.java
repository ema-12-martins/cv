package com.example.demo.dto;

import com.example.demo.model.Expense;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseUpdateRequest {
  private BigDecimal value;
  private LocalDate occurrenceDate;
  private Long label;

  public ExpenseUpdateRequest() {}

  public ExpenseUpdateRequest(Expense expense) {
    this.value = expense.getValue();
    this.occurrenceDate = expense.getOccurrenceDate();
    this.label = expense.getLabelId();
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

  public Long getLabel() {
    return label;
  }

  public void setLabel(Long label) {
    this.label = label;
  }
}
