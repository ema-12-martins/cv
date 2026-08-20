package com.example.demo.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.model.ExpenseLabel;
import com.example.demo.repository.ExpenseLabelRepository;
import com.example.demo.service.ExpenseLabelService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ExpenseLabelController.class)
public class ExpenseLabelControllerTest {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;

  @MockBean private ExpenseLabelService expenseLabelService;
  @MockBean private ExpenseLabelRepository expenseLabelRepository;

  @WithMockUser(username = "test")
  @Test
  public void testGetAllLabels_returnsLabels() throws Exception {
    ExpenseLabel label = new ExpenseLabel();
    label.setId(1L);
    label.setName("Groceries");

    when(expenseLabelService.getAllLabels()).thenReturn(List.of(label));

    mockMvc
        .perform(get("/api/expense-labels"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].name").value("Groceries"));
  }

  @WithMockUser(username = "test")
  @Test
  public void testGetLabelsByUserIdAndCategoryId_returnsLabels() throws Exception {
    ExpenseLabel label = new ExpenseLabel();
    label.setId(1L);
    label.setUserId(1L);
    label.setCategoryId(2L);
    label.setName("Utilities");

    when(expenseLabelService.getLabelsByUserIdAndCategoryId(1L, 2L)).thenReturn(List.of(label));

    mockMvc
        .perform(get("/api/expense-labels/user/1/category/2"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].name").value("Utilities"));
  }

  @WithMockUser(username = "test")
  @Test
  public void testCreateLabel_validInput_returnsCreatedLabel() throws Exception {
    ExpenseLabel request = new ExpenseLabel();
    request.setName("Travel");

    ExpenseLabel saved = new ExpenseLabel();
    saved.setId(10L);
    saved.setUserId(3L);
    saved.setCategoryId(4L);
    saved.setName("Travel");
    saved.setSpent(0.0);
    saved.setTarget(0.0);

    when(expenseLabelRepository.save(any(ExpenseLabel.class))).thenReturn(saved);

    mockMvc
        .perform(
            post("/api/expense-labels/user/3/category/4")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(10))
        .andExpect(jsonPath("$.userId").value(3))
        .andExpect(jsonPath("$.categoryId").value(4))
        .andExpect(jsonPath("$.name").value("Travel"))
        .andExpect(jsonPath("$.spent").value(0.0))
        .andExpect(jsonPath("$.target").value(0.0));
  }

  @WithMockUser(username = "test")
  @Test
  public void testUpdateLabel_existingId_returnsUpdatedLabel() throws Exception {
    ExpenseLabel request = new ExpenseLabel();
    request.setName("Updated");
    request.setUserId(1L);
    request.setCategoryId(2L);

    ExpenseLabel updated = new ExpenseLabel();
    updated.setId(5L);
    updated.setName("Updated");
    updated.setUserId(1L);
    updated.setCategoryId(2L);
    updated.setSpent(0.0);
    updated.setTarget(0.0);

    when(expenseLabelService.getLabelById(5L)).thenReturn(Optional.of(new ExpenseLabel()));
    when(expenseLabelService.saveLabel(any(ExpenseLabel.class))).thenReturn(updated);

    mockMvc
        .perform(
            put("/api/expense-labels/5")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(5))
        .andExpect(jsonPath("$.name").value("Updated"));
  }

  @WithMockUser(username = "test")
  @Test
  public void testUpdateLabel_nonExistingId_returnsNotFound() throws Exception {
    ExpenseLabel request = new ExpenseLabel();
    request.setName("Updated");

    when(expenseLabelService.getLabelById(100L)).thenReturn(Optional.empty());

    mockMvc
        .perform(
            put("/api/expense-labels/100")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound());
  }

  @WithMockUser(username = "test")
  @Test
  public void testDeleteLabel_existingId_returnsNoContent() throws Exception {
    when(expenseLabelService.getLabelById(1L)).thenReturn(Optional.of(new ExpenseLabel()));
    doNothing().when(expenseLabelService).deleteLabel(1L);

    mockMvc.perform(delete("/api/expense-labels/1").with(csrf())).andExpect(status().isNoContent());
  }

  @WithMockUser(username = "test")
  @Test
  public void testDeleteLabel_nonExistingId_returnsNotFound() throws Exception {
    when(expenseLabelService.getLabelById(99L)).thenReturn(Optional.empty());

    mockMvc.perform(delete("/api/expense-labels/99").with(csrf())).andExpect(status().isNotFound());
  }
}
