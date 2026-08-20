package com.example.demo.controller;

import com.example.demo.dto.IncomeInsertRequest;
import com.example.demo.dto.IncomeResponse;
import com.example.demo.dto.IncomeUpdateRequest;
import com.example.demo.model.Income;
import com.example.demo.service.IncomeService;
import java.math.BigDecimal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

  private final IncomeService incomeService;

  public IncomeController(IncomeService incomeService) {
    this.incomeService = incomeService;
  }

  @GetMapping("/user/{userId}/total")
  public ResponseEntity<BigDecimal> getTotalIncomeByUserId(@PathVariable Long userId) {
    BigDecimal totalIncome = incomeService.getTotalIncomeByUserId(userId);
    return new ResponseEntity<>(totalIncome, HttpStatus.OK);
  }

  @GetMapping("/{incomeId}")
  public ResponseEntity<IncomeResponse> getIncome(@PathVariable Long incomeId) {
    Income income = incomeService.getIncomeById(incomeId);
    IncomeResponse response =
        new IncomeResponse(
            income.getId(),
            income.getValue(),
            income.getLabel().getName(),
            income.getLabel().getCategory().getName(),
            income.getOccurrenceDate());
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @PostMapping("/user/{userId}/label/{labelId}")
  public ResponseEntity<Income> createIncome(
      @PathVariable Long userId,
      @PathVariable Long labelId,
      @RequestBody IncomeInsertRequest request) {
    Income income = incomeService.createIncome(userId, labelId, request);
    return new ResponseEntity<>(income, HttpStatus.CREATED);
  }

  @DeleteMapping("/{incomeId}")
  public ResponseEntity<Void> deleteIncome(@PathVariable Long incomeId) {
    incomeService.deleteIncome(incomeId);
    return ResponseEntity.noContent().build(); // Returns 204 No Content
  }

  @PutMapping("/{incomeId}")
  public IncomeUpdateRequest updateIncome(
      @PathVariable Long incomeId, @RequestBody IncomeUpdateRequest request) {

    Income updatedIncome = incomeService.updateIncome(incomeId, request);
    return new IncomeUpdateRequest(updatedIncome);
  }
}
