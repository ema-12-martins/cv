package com.example.demo.model;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

class UserTest {

  @Test
  void testGettersAndSetters() {
    User user = new User();

    Long id = 1L;
    String name = "John Doe";
    String email = "john.doe@example.com";
    Long mobileNumber = 1234567890L;
    LocalDate birthdate = LocalDate.of(1990, 1, 1);
    String passwordHash = "securehash";
    LocalDate lastLogin = LocalDate.now();
    BigDecimal amountSaved = new BigDecimal("1000.50");
    BigDecimal lastPercentage = new BigDecimal("20.75");

    user.setId(id);
    user.setName(name);
    user.setEmail(email);
    user.setMobileNumber(mobileNumber);
    user.setBirthdate(birthdate);
    user.setPasswordHash(passwordHash);
    user.setLastLogin(lastLogin);
    user.setAmountSaved(amountSaved);
    user.setLastPercentage(lastPercentage);

    assertEquals(id, user.getId());
    assertEquals(name, user.getName());
    assertEquals(email, user.getEmail());
    assertEquals(mobileNumber, user.getMobileNumber());
    assertEquals(birthdate, user.getBirthdate());
    assertEquals(passwordHash, user.getPasswordHash());
    assertEquals(lastLogin, user.getLastLogin());
    assertEquals(amountSaved, user.getAmountSaved());
    assertEquals(lastPercentage, user.getLastPercentage());
  }

  @Test
  void testUserDetailsMethods() {
    User user = new User();
    user.setEmail("user@example.com");
    user.setPasswordHash("pass123");

    Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
    assertNotNull(authorities);
    assertEquals(1, authorities.size());
    assertEquals("ROLE_USER", authorities.iterator().next().getAuthority());

    assertEquals("pass123", user.getPassword());
    assertEquals("user@example.com", user.getUsername());
    assertTrue(user.isAccountNonExpired());
    assertTrue(user.isAccountNonLocked());
    assertTrue(user.isCredentialsNonExpired());
    assertTrue(user.isEnabled());
  }
}
