package com.example.demo.repository;

import com.example.demo.model.ExpenseLabel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseLabelRepository extends JpaRepository<ExpenseLabel, Long> {
  List<ExpenseLabel> findByUserIdAndCategoryId(Long userId, Long categoryId);
}
