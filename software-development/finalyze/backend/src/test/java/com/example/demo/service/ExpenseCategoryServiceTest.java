package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.ExpenseCategory;
import com.example.demo.repository.ExpenseCategoryRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExpenseCategoryServiceTest {

  private ExpenseCategoryRepository mockRepository;
  private ExpenseCategoryService service;

  @BeforeEach
  void setUp() {
    mockRepository = mock(ExpenseCategoryRepository.class);
    service = new ExpenseCategoryService(mockRepository);
  }

  @Test
  void getAllCategories_returnsList() {
    List<ExpenseCategory> mockList = List.of(new ExpenseCategory(), new ExpenseCategory());
    when(mockRepository.findAll()).thenReturn(mockList);

    List<ExpenseCategory> result = service.getAllCategories();

    assertEquals(2, result.size());
    verify(mockRepository).findAll();
  }

  @Test
  void getCategoryById_whenFound_returnsOptionalWithCategory() {
    ExpenseCategory category = new ExpenseCategory();
    category.setId(1L);
    when(mockRepository.findById(1L)).thenReturn(Optional.of(category));

    Optional<ExpenseCategory> result = service.getCategoryById(1L);

    assertTrue(result.isPresent());
    assertEquals(1L, result.get().getId());
    verify(mockRepository).findById(1L);
  }

  @Test
  void getCategoryById_whenNotFound_returnsEmptyOptional() {
    when(mockRepository.findById(99L)).thenReturn(Optional.empty());

    Optional<ExpenseCategory> result = service.getCategoryById(99L);

    assertFalse(result.isPresent());
    verify(mockRepository).findById(99L);
  }

  @Test
  void saveCategory_returnsSavedCategory() {
    ExpenseCategory category = new ExpenseCategory();
    category.setName("Groceries");
    when(mockRepository.save(category)).thenReturn(category);

    ExpenseCategory result = service.saveCategory(category);

    assertEquals("Groceries", result.getName());
    verify(mockRepository).save(category);
  }

  @Test
  void deleteCategory_callsRepositoryDeleteById() {
    service.deleteCategory(42L);

    verify(mockRepository).deleteById(42L);
  }
}
