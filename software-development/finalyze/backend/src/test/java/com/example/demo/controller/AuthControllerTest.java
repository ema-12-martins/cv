package com.example.demo.controller;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private UserService userService;
  @MockBean private PasswordEncoder passwordEncoder;

  @InjectMocks private AuthController authController;

  @Captor ArgumentCaptor<User> userCaptor;

  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule()); // ✅ Register the Java Time module
  }

  @WithMockUser(username = "test")
  @Test
  void testRegisterUser_success() throws Exception {
    RegisterRequest request = new RegisterRequest();
    request.setName("Test User");
    request.setEmail("test@example.com");
    request.setMobileNumber(1234567890L);
    request.setBirthdate(LocalDate.of(2000, 1, 1));
    request.setPassword("password");

    User savedUser = new User();
    savedUser.setEmail("test@example.com");

    when(userService.registerNewUser(any(User.class))).thenReturn(savedUser);

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("User registered successfully"));

    verify(userService).registerNewUser(any(User.class));
  }

  @WithMockUser(username = "test")
  @Test
  void testRegisterUser_failure() throws Exception {
    RegisterRequest request = new RegisterRequest();
    request.setEmail("exists@example.com");

    when(userService.registerNewUser(any(User.class)))
        .thenThrow(new RuntimeException("Email already in use"));

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.error").value("Email already in use"));
  }

  @WithMockUser(username = "test")
  @Test
  void testLoginUser_success() throws Exception {
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setEmail("user@example.com");
    loginRequest.setPassword("password");

    User user = new User();
    user.setEmail("user@example.com");
    user.setPasswordHash("hashedPassword");

    when(userService.loadUserByUsername("user@example.com")).thenReturn(user);
    when(passwordEncoder.matches("password", "hashedPassword")).thenReturn(true);

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Login successful"));

    verify(userService).updateLastLogin("user@example.com");
  }

  @WithMockUser(username = "test")
  @Test
  void testLoginUser_invalidPassword() throws Exception {
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setEmail("user@example.com");
    loginRequest.setPassword("wrong");

    User user = new User();
    user.setEmail("user@example.com");
    user.setPasswordHash("correctHash");

    when(userService.loadUserByUsername("user@example.com")).thenReturn(user);
    when(passwordEncoder.matches("wrong", "correctHash")).thenReturn(false);

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.error").value("Invalid credentials"));
  }

  @WithMockUser(username = "test")
  @Test
  void testLoginUser_userNotFound() throws Exception {
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setEmail("notfound@example.com");
    loginRequest.setPassword("password");

    when(userService.loadUserByUsername("notfound@example.com"))
        .thenThrow(new RuntimeException("User not found"));

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.error").value("User not found"));
  }

  @WithMockUser(username = "test")
  @Test
  void testLogout_success() throws Exception {
    mockMvc
        .perform(MockMvcRequestBuilders.post("/api/auth/logout").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Logged out successfully"));
  }
}
