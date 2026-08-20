package com.example.demo.repository;

import com.example.demo.model.IncomeCategory;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeCategoryRepository extends JpaRepository<IncomeCategory, Long> {
  Optional<IncomeCategory> findByName(String name);
}
