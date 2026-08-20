package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class UserAwardTest {

  @Test
  void testGettersAndSetters() {
    UserAward userAward = new UserAward();

    Long id = 1L;
    Award award = new Award();
    User user = new User();

    // Test setting and getting 'id'
    userAward.setId(id);
    assertEquals(id, userAward.getId());

    // Test setting and getting 'award'
    userAward.setAward(award);
    assertEquals(award, userAward.getAward());

    // Test setting and getting 'user'
    userAward.setUser(user);
    assertEquals(user, userAward.getUser());

    // Test setting and getting 'received' (true, false, null)
    userAward.setReceived(Boolean.TRUE);
    assertTrue(userAward.getReceived());

    userAward.setReceived(Boolean.FALSE);
    assertFalse(userAward.getReceived());

    userAward.setReceived(null);
    assertNull(userAward.getReceived());
  }
}
