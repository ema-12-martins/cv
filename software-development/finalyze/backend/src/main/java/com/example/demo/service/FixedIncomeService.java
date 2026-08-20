package com.example.demo.service;

import com.example.demo.model.FixedIncome;
import com.example.demo.repository.FixedIncomeRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FixedIncomeService {

  private final FixedIncomeRepository fixedIncomeRepository;
  private final GamificationService gamificationService;

  @Autowired
  public FixedIncomeService(
      FixedIncomeRepository fixedIncomeRepository, GamificationService gamificationService) {
    this.fixedIncomeRepository = fixedIncomeRepository;
    this.gamificationService = gamificationService;
  }

  /**
   * Retrieves all fixed incomes from the database.
   *
   * @return A list of all FixedIncome objects.
   */
  public List<FixedIncome> getAllFixedIncomes() {
    return fixedIncomeRepository.findAll();
  }

  /**
   * Retrieves a fixed income by its ID.
   *
   * @param id The ID of the fixed income to retrieve.
   * @return An Optional containing the FixedIncome if found, or empty if not.
   */
  public Optional<FixedIncome> getFixedIncomeById(Long id) {
    return fixedIncomeRepository.findById(id);
  }

  /**
   * Saves a FixedIncome object to the database. This method handles both creation and updating of
   * fixed incomes. If the income has an ID, it updates an existing record; otherwise, it creates a
   * new one. It also sets the insertion date for new incomes.
   *
   * @param income The FixedIncome object to save.
   * @return The saved FixedIncome object.
   */
  public FixedIncome saveFixedIncome(FixedIncome income) {
    boolean isNew = (income.getId() == null);

    if (isNew) {
      income.setInsertionDate(LocalDate.now());
    }

    FixedIncome saved = fixedIncomeRepository.save(income);

    if (isNew) {
      gamificationService.addExpPoints(income.getUserId(), 5);
    }

    return saved;
  }

  /**
   * Deletes a fixed income from the database by its ID.
   *
   * @param id The ID of the fixed income to delete.
   */
  public void deleteFixedIncome(Long id) {
    fixedIncomeRepository.deleteById(id);
  }

  // --- NEW METHOD ADDED FOR USER-SPECIFIC FIXED INCOMES ---
  /**
   * Retrieves a list of fixed incomes associated with a specific user ID.
   *
   * @param userId The ID of the user whose fixed incomes are to be retrieved.
   * @return A list of FixedIncome objects belonging to the specified user.
   */
  public List<FixedIncome> getFixedIncomesByUserId(Long userId) {
    return fixedIncomeRepository.findByUserId(userId);
  }
  // --- END NEW METHOD ---
}
