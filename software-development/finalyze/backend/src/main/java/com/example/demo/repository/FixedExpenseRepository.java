package com.example.demo.repository;

import com.example.demo.model.FixedExpense;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FixedExpenseRepository extends JpaRepository<FixedExpense, Long> {
  List<FixedExpense> findByUserId(Long userId);
}
