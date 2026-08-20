package com.example.demo.dto;

import com.example.demo.model.Income;
import java.math.BigDecimal;
import java.time.LocalDate;

public class IncomeUpdateRequest {
  private BigDecimal value;
  private LocalDate occurrenceDate;
  private Long label;

  public IncomeUpdateRequest() {}

  public IncomeUpdateRequest(Income income) {
    this.value = income.getValue();
    this.occurrenceDate = income.getOccurrenceDate();
    this.label = income.getLabelId();
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
