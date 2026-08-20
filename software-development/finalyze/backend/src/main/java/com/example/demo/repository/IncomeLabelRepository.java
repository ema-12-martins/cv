package com.example.demo.repository;

import com.example.demo.model.IncomeLabel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeLabelRepository extends JpaRepository<IncomeLabel, Long> {
  List<IncomeLabel> findByUserIdAndCategoryId(Long userId, Long categoryId);
}
