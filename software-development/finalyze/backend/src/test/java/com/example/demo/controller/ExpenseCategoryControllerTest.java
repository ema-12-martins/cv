package com.example.demo.controller;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.model.ExpenseCategory;
import com.example.demo.service.ExpenseCategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Arrays;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ExpenseCategoryController.class)
public class ExpenseCategoryControllerTest {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;

  @MockBean private ExpenseCategoryService expenseCategoryService;

  @WithMockUser(username = "test")
  @Test
  public void testGetAllCategories_returnsList() throws Exception {
    ExpenseCategory category = new ExpenseCategory();
    category.setId(1L);
    category.setName("Food");

    when(expenseCategoryService.getAllCategories()).thenReturn(Arrays.asList(category));

    mockMvc
        .perform(get("/api/expense_categories"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Food"));
  }

  @WithMockUser(username = "test")
  @Test
  public void testGetCategoryById_found_returnsCategory() throws Exception {
    ExpenseCategory category = new ExpenseCategory();
    category.setId(1L);
    category.setName("Travel");

    when(expenseCategoryService.getCategoryById(1L)).thenReturn(Optional.of(category));

    mockMvc
        .perform(get("/api/expense_categories/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value("Travel"));
  }

  @WithMockUser(username = "test")
  @Test
  public void testGetCategoryById_notFound_returnsNotFound() throws Exception {
    when(expenseCategoryService.getCategoryById(99L)).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/expense_categories/99")).andExpect(status().isNotFound());
  }

  @WithMockUser(username = "test")
  @Test
  public void testCreateCategory_validInput_returnsCreatedCategory() throws Exception {
    ExpenseCategory request = new ExpenseCategory();
    request.setName("Bills");

    ExpenseCategory saved = new ExpenseCategory();
    saved.setId(10L);
    saved.setName("Bills");

    when(expenseCategoryService.saveCategory(any(ExpenseCategory.class))).thenReturn(saved);

    mockMvc
        .perform(
            post("/api/expense_categories")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(10))
        .andExpect(jsonPath("$.name").value("Bills"));
  }

  @WithMockUser(username = "test")
  @Test
  public void testUpdateCategory_existingId_returnsUpdatedCategory() throws Exception {
    ExpenseCategory request = new ExpenseCategory();
    request.setName("Updated");

    ExpenseCategory updated = new ExpenseCategory();
    updated.setId(5L);
    updated.setName("Updated");

    when(expenseCategoryService.getCategoryById(5L)).thenReturn(Optional.of(new ExpenseCategory()));
    when(expenseCategoryService.saveCategory(any(ExpenseCategory.class))).thenReturn(updated);

    mockMvc
        .perform(
            put("/api/expense_categories/5")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(5))
        .andExpect(jsonPath("$.name").value("Updated"));
  }

  @WithMockUser(username = "test")
  @Test
  public void testUpdateCategory_nonExistingId_returnsNotFound() throws Exception {
    ExpenseCategory request = new ExpenseCategory();
    request.setName("Should Not Update");

    when(expenseCategoryService.getCategoryById(99L)).thenReturn(Optional.empty());

    mockMvc
        .perform(
            put("/api/expense_categories/99")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound());
  }

  @WithMockUser(username = "test")
  @Test
  public void testDeleteCategory_existingId_returnsNoContent() throws Exception {
    when(expenseCategoryService.getCategoryById(3L)).thenReturn(Optional.of(new ExpenseCategory()));
    doNothing().when(expenseCategoryService).deleteCategory(3L);

    mockMvc
        .perform(delete("/api/expense_categories/3").with(csrf()))
        .andExpect(status().isNoContent());
  }

  @WithMockUser(username = "test")
  @Test
  public void testDeleteCategory_nonExistingId_returnsNotFound() throws Exception {
    when(expenseCategoryService.getCategoryById(404L)).thenReturn(Optional.empty());

    mockMvc
        .perform(delete("/api/expense_categories/404").with(csrf()))
        .andExpect(status().isNotFound());
  }
}
