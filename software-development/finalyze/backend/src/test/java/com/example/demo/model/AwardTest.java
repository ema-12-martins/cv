package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class AwardTest {

  @Test
  void testGettersAndSetters() {
    Award award = new Award();

    award.setId(1L);
    award.setName("Top Saver");
    award.setDescription("Awarded for saving the most money in a month.");
    award.setConditionType("SAVINGS");
    award.setConditionThreshold(500.0);

    assertEquals(1L, award.getId());
    assertEquals("Top Saver", award.getName());
    assertEquals("Awarded for saving the most money in a month.", award.getDescription());
    assertEquals("SAVINGS", award.getConditionType());
    assertEquals(500.0, award.getConditionThreshold());
  }
}
