package com.example.demo.repository;

import com.example.demo.model.FixedIncome;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FixedIncomeRepository extends JpaRepository<FixedIncome, Long> {
  List<FixedIncome> findByUserId(Long userId);
}
