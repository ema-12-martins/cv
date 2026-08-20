package com.example.demo.service;

import com.example.demo.model.ExpenseLabel;
import com.example.demo.repository.ExpenseLabelRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExpenseLabelService {

  private final ExpenseLabelRepository expenseLabelRepository;

  @Autowired
  public ExpenseLabelService(ExpenseLabelRepository expenseLabelRepository) {
    this.expenseLabelRepository = expenseLabelRepository;
  }

  public List<ExpenseLabel> getAllLabels() {
    return expenseLabelRepository.findAll();
  }

  public Optional<ExpenseLabel> getLabelById(Long id) {
    return expenseLabelRepository.findById(id);
  }

  public ExpenseLabel saveLabel(ExpenseLabel label) {
    return expenseLabelRepository.save(label);
  }

  public void deleteLabel(Long id) {
    expenseLabelRepository.deleteById(id);
  }

  public List<ExpenseLabel> getLabelsByUserIdAndCategoryId(Long userId, Long categoryId) {
    return expenseLabelRepository.findByUserIdAndCategoryId(userId, categoryId);
  }
}
