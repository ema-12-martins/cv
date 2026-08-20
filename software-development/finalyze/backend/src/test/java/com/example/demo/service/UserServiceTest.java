package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserServiceTest {

  @Mock private UserRepository userRepository;
  @Mock private PasswordEncoder passwordEncoder;
  @Mock private IncomeLabelRepository incomeLabelRepository;
  @Mock private IncomeCategoryRepository incomeCategoryRepository;
  @Mock private ExpenseCategoryRepository expenseCategoryRepository;
  @Mock private ExpenseLabelRepository expenseLabelRepository;

  @InjectMocks private UserService userService;

  private User testUser;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    testUser = new User();
    testUser.setId(1L);
    testUser.setEmail("test@example.com");
    testUser.setPasswordHash("pass");
    testUser.setPasswordHash("encodedPass");
    testUser.setName("Test");
    testUser.setMobileNumber(1234567890L);
    testUser.setAmountSaved(BigDecimal.TEN);
    testUser.setBirthdate(LocalDate.of(2000, 1, 1));
  }

  @Test
  void loadUserByUsername_whenUserExists_returnsUser() {
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    UserDetails result = userService.loadUserByUsername("test@example.com");
    assertEquals(testUser, result);
  }

  @Test
  void loadUserByUsername_whenUserNotFound_throwsException() {
    when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());
    assertThrows(
        UsernameNotFoundException.class,
        () -> userService.loadUserByUsername("notfound@example.com"));
  }

  @Test
  void registerNewUser_createsUserAndLabels() {
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
    when(passwordEncoder.encode(any())).thenReturn("encodedPass");
    when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));

    IncomeCategory incomeCat = new IncomeCategory();
    incomeCat.setId(1L);
    when(incomeCategoryRepository.findAll()).thenReturn(List.of(incomeCat));

    ExpenseCategory expenseCat = new ExpenseCategory();
    expenseCat.setId(2L);
    when(expenseCategoryRepository.findAll()).thenReturn(List.of(expenseCat));

    User inputUser = new User();
    inputUser.setEmail("test@example.com");
    inputUser.setPasswordHash("rawPass");

    User saved = userService.registerNewUser(inputUser);
    assertEquals(BigDecimal.ZERO, saved.getAmountSaved());

    verify(incomeLabelRepository).save(any());
    verify(expenseLabelRepository).save(any());
  }

  @Test
  void registerNewUser_whenEmailExists_throwsException() {
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    User inputUser = new User();
    inputUser.setEmail("test@example.com");
    assertThrows(RuntimeException.class, () -> userService.registerNewUser(inputUser));
  }

  @Test
  void updateLastLogin_whenUserExists_updatesDate() {
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    userService.updateLastLogin("test@example.com");
    verify(userRepository).save(testUser);
  }

  @Test
  void updateLastLogin_whenUserNotFound_doesNothing() {
    when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
    userService.updateLastLogin("missing@example.com");
    verify(userRepository, never()).save(any());
  }

  @Test
  void updateUser_updatesFieldsCorrectly() {
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    Map<String, Object> updates = new HashMap<>();
    updates.put("name", "New Name");
    updates.put("mobileNumber", "1234567899");
    updates.put("birthdate", "2001-01-01");

    User updated = userService.updateUser("test@example.com", updates);

    assertNotNull(updated);
    assertEquals("New Name", updated.getName());
    assertEquals(1234567899L, updated.getMobileNumber());
    assertEquals(LocalDate.of(2001, 1, 1), updated.getBirthdate());
  }

  @Test
  void updateUser_withLongMobileNumberType() {
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    Map<String, Object> updates = Map.of("mobileNumber", 9876543210L);
    User updated = userService.updateUser("test@example.com", updates);

    assertNotNull(updated);
    assertEquals(9876543210L, updated.getMobileNumber());
  }

  @Test
  void updateUser_whenUserNotFound_throwsException() {
    when(userRepository.findByEmail("x@example.com")).thenReturn(Optional.empty());
    assertThrows(RuntimeException.class, () -> userService.updateUser("x@example.com", Map.of()));
  }

  @Test
  void deleteUser_byEmail_whenUserExists_deletesUser() {
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    userService.deleteUser("test@example.com");
    verify(userRepository).delete(testUser);
  }

  @Test
  void deleteUser_byEmail_whenUserNotFound_throwsException() {
    when(userRepository.findByEmail("x@example.com")).thenReturn(Optional.empty());
    assertThrows(RuntimeException.class, () -> userService.deleteUser("x@example.com"));
  }

  @Test
  void getAllUsers_returnsAll() {
    when(userRepository.findAll()).thenReturn(List.of(testUser));
    List<User> users = userService.getAllUsers();
    assertEquals(1, users.size());
  }

  @Test
  void getUserById_whenExists_returnsUser() {
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    Optional<User> result = userService.getUserById(1L);
    assertTrue(result.isPresent());
  }

  @Test
  void saveUser_savesAndReturnsUser() {
    when(userRepository.save(any())).thenReturn(testUser);
    User result = userService.saveUser(testUser);
    assertEquals(testUser, result);
  }

  @Test
  void deleteUser_byId_deletesUser() {
    userService.deleteUser(1L);
    verify(userRepository).deleteById(1L);
  }

  @Test
  void getLastPercentageByIdOrZero_whenExists_returnsValue() {
    testUser.setLastPercentage(new BigDecimal("55.5"));
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    BigDecimal result = userService.getLastPercentageByIdOrZero(1L);
    assertEquals(new BigDecimal("55.5"), result);
  }

  @Test
  void getLastPercentageByIdOrZero_whenNotExists_returnsZero() {
    when(userRepository.findById(2L)).thenReturn(Optional.empty());
    assertEquals(BigDecimal.ZERO, userService.getLastPercentageByIdOrZero(2L));
  }

  @Test
  void updateLastPercentage_whenExists_updatesAndReturnsUser() {
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    BigDecimal newValue = new BigDecimal("77.7");
    testUser.setLastPercentage(null);

    when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));
    User result = userService.updateLastPercentage(1L, newValue);
    assertEquals(newValue, result.getLastPercentage());
  }

  @Test
  void updateLastPercentage_whenNotFound_throwsException() {
    when(userRepository.findById(1L)).thenReturn(Optional.empty());
    assertThrows(
        RuntimeException.class, () -> userService.updateLastPercentage(1L, BigDecimal.TEN));
  }
}
