package com.example.demo.repository;

import com.example.demo.model.ExpenseTarget;
import com.example.demo.model.ExpenseTarget.ExpenseTargetId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseTargetRepository extends JpaRepository<ExpenseTarget, ExpenseTargetId> {}
