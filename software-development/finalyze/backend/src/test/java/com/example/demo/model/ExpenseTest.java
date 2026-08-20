package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class ExpenseTest {

  @Test
  void testGettersAndSetters() {
    Expense expense = new Expense();

    Long id = 1L;
    Long labelId = 2L;
    Long userId = 3L;
    BigDecimal value = new BigDecimal("123.45");
    LocalDate occurrenceDate = LocalDate.of(2024, 5, 15);
    LocalDate insertionDate = LocalDate.of(2024, 5, 16);

    expense.setId(id);
    expense.setLabelId(labelId);
    expense.setUserId(userId);
    expense.setValue(value);
    expense.setOccurrenceDate(occurrenceDate);
    expense.setInsertionDate(insertionDate);

    assertEquals(id, expense.getId());
    assertEquals(labelId, expense.getLabelId());
    assertEquals(userId, expense.getUserId());
    assertEquals(value, expense.getValue());
    assertEquals(occurrenceDate, expense.getOccurrenceDate());
    assertEquals(insertionDate, expense.getInsertionDate());

    // Label is not settable, so should be null by default
    assertNull(expense.getLabel());
  }
}
