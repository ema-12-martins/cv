package com.example.demo.controller;

import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.model.SavingsTarget;
import com.example.demo.service.SavingsTargetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.*;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(SavingsTargetController.class)
class SavingsTargetControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private SavingsTargetService savingsTargetService;

  @Autowired private ObjectMapper objectMapper;

  private SavingsTarget savingsTarget;

  @BeforeEach
  void setUp() {
    savingsTarget = new SavingsTarget();
    savingsTarget.setId(1L);
    savingsTarget.setUserId(123L);
    savingsTarget.setName("Buy a Car");
    savingsTarget.setAmount(10000L);
    savingsTarget.setByDate(LocalDate.of(2025, 12, 31));
    savingsTarget.setPriority(1L);
    savingsTarget.setActive(true);
  }

  @WithMockUser(username = "test")
  @Test
  void testGetHighestPrioritySavingsTarget_Found() throws Exception {
    when(savingsTargetService.getHighestPrioritySavingsTarget(123L))
        .thenReturn(Optional.of(savingsTarget));

    mockMvc
        .perform(
            get("/api/savings-target/highest-priority")
                .param("userId", "123")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1L))
        .andExpect(jsonPath("$.userId").value(123L))
        .andExpect(jsonPath("$.name").value("Buy a Car"))
        .andExpect(jsonPath("$.amount").value(10000))
        .andExpect(jsonPath("$.priority").value(1))
        .andExpect(jsonPath("$.active").value(true))
        .andExpect(jsonPath("$.byDate").value("2025-12-31"));
  }

  @WithMockUser(username = "test")
  @Test
  void testGetHighestPrioritySavingsTarget_NotFound() throws Exception {
    when(savingsTargetService.getHighestPrioritySavingsTarget(456L)).thenReturn(Optional.empty());

    mockMvc
        .perform(
            get("/api/savings-target/highest-priority")
                .param("userId", "456")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());
  }

  @WithMockUser
  @Test
  void testCreateSavingsTarget() throws Exception {
    when(savingsTargetService.saveSavingsTarget(any())).thenReturn(savingsTarget);

    mockMvc
        .perform(
            post("/api/savings-target")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(savingsTarget)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1L));
  }

  @WithMockUser
  @Test
  void testCountSavingsTargets() throws Exception {
    when(savingsTargetService.countSavingsTargets()).thenReturn(3L);

    mockMvc
        .perform(get("/api/savings-target/count"))
        .andExpect(status().isOk())
        .andExpect(content().string("3"));
  }

  @WithMockUser
  @Test
  void testGetSavingsTargetsByUserId() throws Exception {
    List<SavingsTarget> list = List.of(savingsTarget);
    when(savingsTargetService.getAllByUserId(123L)).thenReturn(list);

    mockMvc
        .perform(get("/api/savings-target/user").param("userId", "123"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1L));
  }

  @WithMockUser
  @Test
  void testReorderSavingGoals_MixedFoundAndNotFound() throws Exception {
    SavingsTarget goal1 = new SavingsTarget();
    goal1.setId(1L);
    goal1.setPriority(1L);

    SavingsTarget goal2 = new SavingsTarget();
    goal2.setId(2L);
    goal2.setPriority(2L);

    when(savingsTargetService.getById(1L)).thenReturn(Optional.of(savingsTarget));
    when(savingsTargetService.getById(2L)).thenReturn(Optional.empty());

    mockMvc
        .perform(
            put("/api/savings-target/reorder")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(List.of(goal1, goal2))))
        .andExpect(status().isOk());

    verify(savingsTargetService, times(1)).saveSavingsTarget(any());
  }
}
