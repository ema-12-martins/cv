package com.example.demo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.model.ExpenseTarget;
import com.example.demo.service.ExpenseTargetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ExpenseTargetController.class)
public class ExpenseTargetControllerTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;

  @MockBean private ExpenseTargetService service;

  @WithMockUser(username = "test")
  @Test
  public void testGetAll_returnsList() throws Exception {
    ExpenseTarget target = new ExpenseTarget();
    target.setExpenseCategoryId(1L);
    target.setUserId(2L);
    target.setTarget((long) 500.0);

    Mockito.when(service.getAll()).thenReturn(Collections.singletonList(target));

    mockMvc
        .perform(get("/api/expense_targets"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].expenseCategoryId").value(1L))
        .andExpect(jsonPath("$[0].userId").value(2L))
        .andExpect(jsonPath("$[0].target").value(500.0));
  }

  @WithMockUser(username = "test")
  @Test
  public void testGetById_exists_returnsTarget() throws Exception {
    ExpenseTarget target = new ExpenseTarget();
    target.setExpenseCategoryId(1L);
    target.setUserId(2L);
    target.setTarget((long) 300.0);

    Mockito.when(service.getById(1L, 2L)).thenReturn(Optional.of(target));

    mockMvc
        .perform(get("/api/expense_targets/1/2"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.target").value(300.0));
  }

  @WithMockUser(username = "test")
  @Test
  public void testGetById_notExists_returnsNotFound() throws Exception {
    Mockito.when(service.getById(1L, 2L)).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/expense_targets/1/2")).andExpect(status().isNotFound());
  }

  @WithMockUser(username = "test")
  @Test
  public void testCreate_returnsCreatedTarget() throws Exception {
    ExpenseTarget input = new ExpenseTarget();
    input.setExpenseCategoryId(1L);
    input.setUserId(2L);
    input.setTarget((long) 400.0);

    ExpenseTarget saved = new ExpenseTarget();
    saved.setExpenseCategoryId(1L);
    saved.setUserId(2L);
    saved.setTarget((long) 400.0);

    Mockito.when(service.save(any(ExpenseTarget.class))).thenReturn(saved);

    mockMvc
        .perform(
            post("/api/expense_targets")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.target").value(400.0));
  }

  @WithMockUser(username = "test")
  @Test
  public void testUpdate_exists_returnsUpdatedTarget() throws Exception {
    ExpenseTarget input = new ExpenseTarget();
    input.setTarget((long) 700.0);

    ExpenseTarget saved = new ExpenseTarget();
    saved.setExpenseCategoryId(1L);
    saved.setUserId(2L);
    saved.setTarget((long) 700.0);

    Mockito.when(service.getById(1L, 2L)).thenReturn(Optional.of(new ExpenseTarget()));
    Mockito.when(service.save(any(ExpenseTarget.class))).thenReturn(saved);

    mockMvc
        .perform(
            put("/api/expense_targets/1/2")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.target").value(700.0));
  }

  @WithMockUser(username = "test")
  @Test
  public void testUpdate_notExists_returnsNotFound() throws Exception {
    ExpenseTarget input = new ExpenseTarget();
    input.setTarget((long) 100.0);

    Mockito.when(service.getById(1L, 2L)).thenReturn(Optional.empty());

    mockMvc
        .perform(
            put("/api/expense_targets/1/2")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
        .andExpect(status().isNotFound());
  }

  @WithMockUser(username = "test")
  @Test
  public void testDelete_exists_returnsNoContent() throws Exception {
    Mockito.when(service.getById(1L, 2L)).thenReturn(Optional.of(new ExpenseTarget()));
    doNothing().when(service).delete(1L, 2L);

    mockMvc
        .perform(delete("/api/expense_targets/1/2").with(csrf()))
        .andExpect(status().isNoContent());
  }

  @WithMockUser(username = "test")
  @Test
  public void testDelete_notExists_returnsNotFound() throws Exception {
    Mockito.when(service.getById(1L, 2L)).thenReturn(Optional.empty());

    mockMvc
        .perform(delete("/api/expense_targets/1/2").with(csrf()))
        .andExpect(status().isNotFound());
  }
}
