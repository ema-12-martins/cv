package com.example.demo.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class TrackingEntriesRequestTest {

  @Test
  void testConstructorAndGetters() {
    LocalDate date = LocalDate.of(2025, 5, 30);
    TrackingEntriesRequest request =
        new TrackingEntriesRequest(
            1L, new BigDecimal("99.99"), "Groceries", "Food", date, "EXPENSE");

    assertEquals(1L, request.getId());
    assertEquals(new BigDecimal("99.99"), request.getValue());
    assertEquals("Groceries", request.getLabel());
    assertEquals("Food", request.getCategory());
    assertEquals(date, request.getOccurrenceDate());
    assertEquals("EXPENSE", request.getType());
  }

  @Test
  void testSettersAndGetters() {
    TrackingEntriesRequest request = new TrackingEntriesRequest(null, null, null, null, null, null);

    request.setId(2L);
    request.setValue(new BigDecimal("250.00"));
    request.setLabel("Salary");
    request.setCategory("Income");
    request.setOccurrenceDate(LocalDate.of(2025, 6, 1));
    request.setType("INCOME");

    assertEquals(2L, request.getId());
    assertEquals(new BigDecimal("250.00"), request.getValue());
    assertEquals("Salary", request.getLabel());
    assertEquals("Income", request.getCategory());
    assertEquals(LocalDate.of(2025, 6, 1), request.getOccurrenceDate());
    assertEquals("INCOME", request.getType());
  }
}
