package com.example.demo.service;

import com.example.demo.model.FixedExpense;
import com.example.demo.repository.FixedExpenseRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FixedExpenseService {

  private final FixedExpenseRepository fixedExpenseRepository;

  @Autowired
  public FixedExpenseService(FixedExpenseRepository fixedExpenseRepository) {
    this.fixedExpenseRepository = fixedExpenseRepository;
  }

  public List<FixedExpense> getAllFixedExpenses() {
    return fixedExpenseRepository.findAll();
  }

  public Optional<FixedExpense> getFixedExpenseById(Long id) {
    return fixedExpenseRepository.findById(id);
  }

  public FixedExpense saveFixedExpense(FixedExpense expense) {
    return fixedExpenseRepository.save(expense);
  }

  public void deleteFixedExpense(Long id) {
    fixedExpenseRepository.deleteById(id);
  }

  public List<FixedExpense> getFixedExpensesByUserId(Long userId) {
    return fixedExpenseRepository.findByUserId(userId);
  }
}
