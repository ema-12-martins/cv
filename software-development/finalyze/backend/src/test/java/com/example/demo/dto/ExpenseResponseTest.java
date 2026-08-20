package com.example.demo.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class ExpenseResponseTest {

  @Test
  void testConstructorAndGetters() {
    Long id = 1L;
    BigDecimal value = new BigDecimal("123.45");
    String labelName = "Groceries";
    String categoryName = "Food";
    LocalDate date = LocalDate.of(2025, 5, 30);

    ExpenseResponse response = new ExpenseResponse(id, value, labelName, categoryName, date);

    assertEquals(id, response.getId());
    assertEquals(value, response.getValue());
    assertEquals(labelName, response.getLabelName());
    assertEquals(categoryName, response.getCategoryName());
    assertEquals(date, response.getOccurrenceDate());
  }

  @Test
  void testSetters() {
    ExpenseResponse response = new ExpenseResponse(null, null, null, null, null);

    Long newId = 2L;
    BigDecimal newValue = new BigDecimal("456.78");
    String newLabelName = "Transport";
    String newCategoryName = "Travel";
    LocalDate newDate = LocalDate.of(2025, 6, 1);

    response.setId(newId);
    response.setValue(newValue);
    response.setLabelName(newLabelName);
    response.setCategoryName(newCategoryName);
    response.setOccurrenceDate(newDate);

    assertEquals(newId, response.getId());
    assertEquals(newValue, response.getValue());
    assertEquals(newLabelName, response.getLabelName());
    assertEquals(newCategoryName, response.getCategoryName());
    assertEquals(newDate, response.getOccurrenceDate());
  }
}
