package com.example.demo.service;

import com.example.demo.model.ExpenseCategory;
import com.example.demo.repository.ExpenseCategoryRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExpenseCategoryService {

  private final ExpenseCategoryRepository expenseCategoryRepository;

  @Autowired
  public ExpenseCategoryService(ExpenseCategoryRepository expenseCategoryRepository) {
    this.expenseCategoryRepository = expenseCategoryRepository;
  }

  public List<ExpenseCategory> getAllCategories() {
    return expenseCategoryRepository.findAll();
  }

  public Optional<ExpenseCategory> getCategoryById(Long id) {
    return expenseCategoryRepository.findById(id);
  }

  public ExpenseCategory saveCategory(ExpenseCategory category) {
    return expenseCategoryRepository.save(category);
  }

  public void deleteCategory(Long id) {
    expenseCategoryRepository.deleteById(id);
  }
}
