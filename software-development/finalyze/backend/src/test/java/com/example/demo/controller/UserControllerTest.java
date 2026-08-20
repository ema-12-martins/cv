package com.example.demo.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for unit testing
class UserControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private UserService userService;

  @Autowired private ObjectMapper objectMapper;

  @BeforeEach
  void setup() {
    objectMapper.registerModule(new JavaTimeModule()); // for LocalDate serialization
  }

  private User getMockUser() {
    User user = new User();
    user.setId(1L);
    user.setEmail("user@example.com");
    user.setPasswordHash("hashed");
    user.setName("John Doe");
    user.setMobileNumber(1234567890L);
    user.setBirthdate(LocalDate.of(1990, 1, 1));
    user.setLastPercentage(new BigDecimal("12.5"));
    return user;
  }

  @Test
  void testGetCurrentUser_success() throws Exception {
    User user = getMockUser();

    // Simulate Spring Security context
    Authentication auth = Mockito.mock(Authentication.class);
    SecurityContext context = Mockito.mock(SecurityContext.class);
    when(context.getAuthentication()).thenReturn(auth);
    when(auth.getName()).thenReturn(user.getEmail());
    SecurityContextHolder.setContext(context);

    when(userService.loadUserByUsername(user.getEmail())).thenReturn(user);

    mockMvc
        .perform(get("/api/user/me"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value(user.getEmail()))
        .andExpect(jsonPath("$.passwordHash").doesNotExist());
  }

  @WithMockUser(username = "test@example.com") // match the email you're expecting
  @Test
  void testUpdateProfile_success() throws Exception {
    User user = getMockUser();
    user.setEmail("test@example.com");

    Map<String, Object> updates = Map.of("name", "Updated Name");

    when(userService.updateUser(eq("test@example.com"), any())).thenReturn(user);

    mockMvc
        .perform(
            put("/api/user/update")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updates)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("test@example.com"));
  }

  @WithMockUser(username = "user@example.com")
  @Test
  void testDeleteAccount_success() throws Exception {
    User user = getMockUser();

    MockHttpServletRequestBuilder request = delete("/api/user/delete").with(user(user));

    mockMvc
        .perform(request)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Account deleted"));

    verify(userService).deleteUser(eq(user.getEmail()));
  }

  @Test
  void testGetLastPercentage_success() throws Exception {
    BigDecimal percentage = new BigDecimal("15.25");
    when(userService.getLastPercentageByIdOrZero(1L)).thenReturn(percentage);

    mockMvc
        .perform(get("/api/user/1/lastPercentage"))
        .andExpect(status().isOk())
        .andExpect(content().string("15.25"));
  }

  @Test
  void testUpdateLastPercentage_withStringValue() throws Exception {
    User user = getMockUser();
    when(userService.updateLastPercentage(eq(1L), eq(new BigDecimal("20.00")))).thenReturn(user);

    Map<String, Object> body = Map.of("lastPercentage", "20.00");

    mockMvc
        .perform(
            put("/api/user/1/lastPercentage")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("user@example.com"));
  }

  @Test
  void testUpdateLastPercentage_withNumberValue() throws Exception {
    User user = getMockUser();
    when(userService.updateLastPercentage(eq(1L), eq(new BigDecimal("20.0")))).thenReturn(user);

    Map<String, Object> body = Map.of("lastPercentage", 20.0);

    mockMvc
        .perform(
            put("/api/user/1/lastPercentage")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("user@example.com"));
  }

  @Test
  void testUpdateLastPercentage_missingField() throws Exception {
    Map<String, Object> body = Map.of("wrongField", 15);

    mockMvc
        .perform(
            put("/api/user/1/lastPercentage")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isBadRequest());
  }

  @Test
  void testUpdateLastPercentage_invalidType() throws Exception {
    Map<String, Object> body = Map.of("lastPercentage", List.of(1, 2));

    mockMvc
        .perform(
            put("/api/user/1/lastPercentage")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isBadRequest());
  }

  @Test
  void testUpdateLastPercentage_invalidString() throws Exception {
    Map<String, Object> body = Map.of("lastPercentage", "notANumber");

    mockMvc
        .perform(
            put("/api/user/1/lastPercentage")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isBadRequest());
  }
}
