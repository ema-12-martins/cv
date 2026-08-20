package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class IncomeTest {

  @Test
  void testGettersAndSetters() {
    Income income = new Income();

    Long id = 1L;
    Long labelId = 2L;
    Long userId = 3L;
    BigDecimal value = new BigDecimal("1000.00");
    LocalDate occurrenceDate = LocalDate.of(2024, 5, 1);
    LocalDate insertionDate = LocalDate.of(2024, 5, 2);
    IncomeLabel incomeLabel = new IncomeLabel();

    income.setId(id);
    income.setLabelId(labelId);
    income.setUserId(userId);
    income.setValue(value);
    income.setOccurrenceDate(occurrenceDate);
    income.setInsertionDate(insertionDate);

    // The label is not settable via setter, but test the getter returns null
    assertNull(income.getLabel());

    // Assertions
    assertEquals(id, income.getId());
    assertEquals(labelId, income.getLabelId());
    assertEquals(userId, income.getUserId());
    assertEquals(value, income.getValue());
    assertEquals(occurrenceDate, income.getOccurrenceDate());
    assertEquals(insertionDate, income.getInsertionDate());
  }
}
