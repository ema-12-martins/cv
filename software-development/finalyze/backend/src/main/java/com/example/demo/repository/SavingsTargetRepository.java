package com.example.demo.repository;

import com.example.demo.model.SavingsTarget;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SavingsTargetRepository extends JpaRepository<SavingsTarget, Long> {
  @Query(
      "SELECT s FROM SavingsTarget s WHERE s.userId = :userId AND s.active = true AND s.priority ="
          + " 1")
  Optional<SavingsTarget> findHighestPriorityByUserId(Long userId);

  List<SavingsTarget> findAllByUserId(Long userId);

  long countByUserId(Long userId);
}
