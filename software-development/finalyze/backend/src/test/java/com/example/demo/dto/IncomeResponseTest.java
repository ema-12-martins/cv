package com.example.demo.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class IncomeResponseTest {

  @Test
  void testConstructorAndGetters() {
    LocalDate date = LocalDate.of(2025, 5, 30);
    IncomeResponse response =
        new IncomeResponse(1L, new BigDecimal("1500.00"), "Salary", "Income", date);

    assertEquals(1L, response.getId());
    assertEquals(new BigDecimal("1500.00"), response.getValue());
    assertEquals("Salary", response.getLabelName());
    assertEquals("Income", response.getCategoryName());
    assertEquals(date, response.getOccurrenceDate());
  }

  @Test
  void testSettersAndGetters() {
    IncomeResponse response = new IncomeResponse(null, null, null, null, null);

    response.setId(2L);
    response.setValue(new BigDecimal("2500.50"));
    response.setLabelName("Bonus");
    response.setCategoryName("Additional");
    response.setOccurrenceDate(LocalDate.of(2025, 6, 1));

    assertEquals(2L, response.getId());
    assertEquals(new BigDecimal("2500.50"), response.getValue());
    assertEquals("Bonus", response.getLabelName());
    assertEquals("Additional", response.getCategoryName());
    assertEquals(LocalDate.of(2025, 6, 1), response.getOccurrenceDate());
  }
}
