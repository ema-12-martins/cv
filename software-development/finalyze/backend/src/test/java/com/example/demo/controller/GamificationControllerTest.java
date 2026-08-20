package com.example.demo.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.model.Gamification;
import com.example.demo.service.GamificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(GamificationController.class)
public class GamificationControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private GamificationService gamificationService;

  @Autowired private ObjectMapper objectMapper;

  private Gamification exampleGamification;

  @BeforeEach
  void setUp() {
    exampleGamification = new Gamification();
    exampleGamification.setId(1L);
    exampleGamification.setUserId(42L);
    exampleGamification.setLevel(5L);
    exampleGamification.setExpPoints(150L);
  }

  @WithMockUser(username = "test")
  @Test
  void testGetUserPoints_returnsPoints() throws Exception {
    when(gamificationService.getUserPoints(42L)).thenReturn(150);

    mockMvc
        .perform(get("/api/gamification/user/42/points").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().string("150"));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetUserPoints_returnsZeroWhenNoData() throws Exception {
    when(gamificationService.getUserPoints(99L)).thenReturn(0);

    mockMvc
        .perform(get("/api/gamification/user/99/points").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().string("0"));
  }

  @WithMockUser(username = "test")
  @Test
  void testUpdateUserPoints_success() throws Exception {
    Map<String, Integer> body = Map.of("points", 10);

    when(gamificationService.updateExpPoints(eq(42L), eq(10))).thenReturn(exampleGamification);

    mockMvc
        .perform(
            put("/api/gamification/user/42/points")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.userId").value(42))
        .andExpect(jsonPath("$.level").value(5))
        .andExpect(jsonPath("$.expPoints").value(150));
  }

  @WithMockUser(username = "test")
  @Test
  void testUpdateUserPoints_badRequest_whenPointsMissing() throws Exception {
    Map<String, Integer> body = Map.of(); // empty map, no "points"

    mockMvc
        .perform(
            put("/api/gamification/user/42/points")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isBadRequest());
  }

  @WithMockUser(username = "test")
  @Test
  void testGetGamificationForUser_found() throws Exception {
    when(gamificationService.getGamificationForUser(42L)).thenReturn(exampleGamification);

    mockMvc
        .perform(get("/api/gamification/user/42").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.userId").value(42))
        .andExpect(jsonPath("$.level").value(5))
        .andExpect(jsonPath("$.expPoints").value(150));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetGamificationForUser_notFound() throws Exception {
    when(gamificationService.getGamificationForUser(42L)).thenReturn(null);

    mockMvc.perform(get("/api/gamification/user/42").with(csrf())).andExpect(status().isNotFound());
  }
}
