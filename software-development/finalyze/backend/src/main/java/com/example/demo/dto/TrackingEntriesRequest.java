package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TrackingEntriesRequest {
  private BigDecimal value;
  private Long id;
  private LocalDate occurrenceDate;
  private String type;
  private String label;
  private String category;

  public TrackingEntriesRequest(
      Long id,
      BigDecimal value,
      String label,
      String category,
      LocalDate occurrenceDate,
      String type) {
    this.id = id;
    this.value = value;
    this.label = label;
    this.category = category;
    this.occurrenceDate = occurrenceDate;
    this.type = type;
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

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
}
