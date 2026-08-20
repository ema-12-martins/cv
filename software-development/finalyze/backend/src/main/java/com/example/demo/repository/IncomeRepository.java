package com.example.demo.repository;

import com.example.demo.model.Income;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
  List<Income> findByUserId(Long userId);

  @Query("SELECT SUM(i.value) FROM Income i WHERE i.userId = :userId")
  BigDecimal sumIncomesByUserId(@Param("userId") Long userId);
}
