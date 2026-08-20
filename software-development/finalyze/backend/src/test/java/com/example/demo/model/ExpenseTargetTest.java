package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class ExpenseTargetTest {

  @Test
  void testGettersAndSetters() {
    ExpenseTarget expenseTarget = new ExpenseTarget();
    expenseTarget.setExpenseCategoryId(1L);
    expenseTarget.setUserId(2L);
    expenseTarget.setTarget(500L);

    assertEquals(1L, expenseTarget.getExpenseCategoryId());
    assertEquals(2L, expenseTarget.getUserId());
    assertEquals(500L, expenseTarget.getTarget());
  }

  @Test
  void testExpenseTargetIdEqualsAndHashCode() {
    ExpenseTarget.ExpenseTargetId id1 = new ExpenseTarget.ExpenseTargetId(1L, 2L);
    ExpenseTarget.ExpenseTargetId id2 = new ExpenseTarget.ExpenseTargetId(1L, 2L);
    ExpenseTarget.ExpenseTargetId id3 = new ExpenseTarget.ExpenseTargetId(1L, 3L);
    ExpenseTarget.ExpenseTargetId id4 = new ExpenseTarget.ExpenseTargetId(2L, 2L);
    ExpenseTarget.ExpenseTargetId idNull = new ExpenseTarget.ExpenseTargetId();

    // Equals
    assertEquals(id1, id2); // same values
    assertNotEquals(id1, id3); // different userId
    assertNotEquals(id1, id4); // different expenseCategoryId
    assertNotEquals(id1, null); // null
    assertNotEquals(id1, "other"); // different class
    assertEquals(id1, id1); // same object

    // HashCode
    assertEquals(id1.hashCode(), id2.hashCode());
    assertNotEquals(id1.hashCode(), id3.hashCode());
  }
}
