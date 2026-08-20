package com.example.demo.service;

import com.example.demo.model.ExpenseTarget;
import com.example.demo.model.ExpenseTarget.ExpenseTargetId;
import com.example.demo.repository.ExpenseTargetRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExpenseTargetService {

  private final ExpenseTargetRepository repository;

  @Autowired
  public ExpenseTargetService(ExpenseTargetRepository repository) {
    this.repository = repository;
  }

  public List<ExpenseTarget> getAll() {
    return repository.findAll();
  }

  public Optional<ExpenseTarget> getById(Long categoryId, Long userId) {
    return repository.findById(new ExpenseTargetId(categoryId, userId));
  }

  public ExpenseTarget save(ExpenseTarget target) {
    return repository.save(target);
  }

  public void delete(Long categoryId, Long userId) {
    repository.deleteById(new ExpenseTargetId(categoryId, userId));
  }
}
