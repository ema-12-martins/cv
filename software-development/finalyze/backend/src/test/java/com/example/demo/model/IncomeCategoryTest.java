package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class IncomeCategoryTest {

  @Test
  void testGettersAndSetters() {
    IncomeCategory category = new IncomeCategory();

    Long id = 1L;
    String name = "Salary";

    category.setId(id);
    category.setName(name);

    assertEquals(id, category.getId());
    assertEquals(name, category.getName());
  }
}
