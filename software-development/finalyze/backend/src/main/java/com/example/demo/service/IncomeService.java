package com.example.demo.service;

import com.example.demo.dto.IncomeInsertRequest;
import com.example.demo.dto.IncomeUpdateRequest;
import com.example.demo.model.Income;
import com.example.demo.repository.IncomeRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IncomeService {

  private final IncomeRepository incomeRepository;
  private final GamificationService gamificationService;

  @Autowired
  public IncomeService(IncomeRepository incomeRepository, GamificationService gamificationService) {
    this.incomeRepository = incomeRepository;
    this.gamificationService = gamificationService;
  }

  public BigDecimal getTotalIncomeByUserId(Long userId) {
    BigDecimal total = incomeRepository.sumIncomesByUserId(userId);
    return total != null ? total : BigDecimal.ZERO;
  }

  public Income getIncomeById(Long incomeId) {
    return incomeRepository
        .findById(incomeId)
        .orElseThrow(() -> new RuntimeException("Income not found with id: " + incomeId));
  }

  public Income createIncome(Long userId, Long labelId, IncomeInsertRequest request) {
    Income income = new Income();
    income.setUserId(userId);
    income.setLabelId(labelId);
    income.setValue(request.getValue());
    income.setOccurrenceDate(request.getOccurrenceDate());
    income.setInsertionDate(LocalDate.now());

    Income saved = incomeRepository.save(income);
    gamificationService.addExpPoints(userId, 5);

    return saved;
  }

  public void deleteIncome(Long incomeId) {
    if (!incomeRepository.existsById(incomeId)) {
      throw new EntityNotFoundException("Income not found with id: " + incomeId);
    }
    incomeRepository.deleteById(incomeId);
  }

  public Income updateIncome(Long incomeId, IncomeUpdateRequest request) {
    Income income =
        incomeRepository
            .findById(incomeId)
            .orElseThrow(() -> new RuntimeException("Income not found"));

    income.setValue(request.getValue());
    income.setOccurrenceDate(request.getOccurrenceDate());
    income.setLabelId(request.getLabel());

    return incomeRepository.save(income);
  }
}
