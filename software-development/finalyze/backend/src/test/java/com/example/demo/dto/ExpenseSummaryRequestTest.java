package com.example.demo.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

class ExpenseSummaryRequestTest {

  @Test
  void testNoArgsConstructorAndSetters() {
    ExpenseSummaryRequest request = new ExpenseSummaryRequest();

    request.setUserId(1L);
    request.setYear(2025);
    request.setMonth(5);
    request.setCategoryId(10L);

    assertEquals(1L, request.getUserId());
    assertEquals(2025, request.getYear());
    assertEquals(5, request.getMonth());
    assertEquals(10L, request.getCategoryId());
  }

  @Test
  void testThreeArgsConstructor() {
    ExpenseSummaryRequest request = new ExpenseSummaryRequest(2L, 2024, 4);

    assertEquals(2L, request.getUserId());
    assertEquals(2024, request.getYear());
    assertEquals(4, request.getMonth());
    assertNull(request.getCategoryId());
  }

  @Test
  void testFourArgsConstructor() {
    ExpenseSummaryRequest request = new ExpenseSummaryRequest(3L, 2023, 3, 20L);

    assertEquals(3L, request.getUserId());
    assertEquals(2023, request.getYear());
    assertEquals(3, request.getMonth());
    assertEquals(20L, request.getCategoryId());
  }
}
