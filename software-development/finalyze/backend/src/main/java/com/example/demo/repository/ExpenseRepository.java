package com.example.demo.repository;

import com.example.demo.dto.ExpenseCategoryMonthSummary;
import com.example.demo.model.Expense;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
  List<Expense> findByUserId(Long userId);

  @Query("SELECT SUM(e.value) FROM Expense e WHERE e.userId = :userId")
  Double findTotalExpensesByUserId(@Param("userId") Long userId);

  @Query("SELECT e FROM Expense e WHERE e.userId = :userId AND e.occurrenceDate >= :startDate")
  List<Expense> findByUserIdAndOccurrenceDateAfter(
      @Param("userId") Long userId, @Param("startDate") LocalDate startDate);

  @Query(
      """
        SELECT new com.example.demo.dto.ExpenseCategoryMonthSummary(
            ec.name,
            CAST(SUM(e.value) AS java.math.BigDecimal)
        )
        FROM Expense e
        JOIN e.label el
        JOIN el.category ec
        WHERE e.userId = :userId
          AND (:year IS NULL OR YEAR(e.occurrenceDate) = :year)
          AND (:month IS NULL OR MONTH(e.occurrenceDate) = :month)
        GROUP BY ec.name
      """)
  List<ExpenseCategoryMonthSummary> getExpenseSumByCategory(
      @Param("userId") Long userId, @Param("year") Integer year, @Param("month") Integer month);

  @Query(
      value =
          """
            SELECT userSum.categoryName AS categoryName, AVG(userSum.total) AS averageTotal
            FROM (
                SELECT ec.name AS categoryName, SUM(e.value) AS total
                FROM "expense" e
                JOIN "expense_label" el ON e.label_id = el.id
                JOIN "expense_category" ec ON el.category_id = ec.id
                WHERE (:year IS NULL OR EXTRACT(YEAR FROM e.occurrence_date) = :year)
                  AND (:month IS NULL OR EXTRACT(MONTH FROM e.occurrence_date) = :month)
                GROUP BY e.user_id, ec.name
            ) userSum
            GROUP BY userSum.categoryName
          """,
      nativeQuery = true)
  List<ExpenseCategoryMonthSummary> getAverageExpenseByCategory(
      @Param("year") Integer year, @Param("month") Integer month);

  @Query(
      "SELECT SUM(e.value) FROM Expense e "
          + "JOIN ExpenseLabel el ON e.labelId = el.id "
          + "JOIN ExpenseCategory ec ON el.categoryId = ec.id "
          + "WHERE e.userId = :userId AND ec.name = :categoryName")
  Double findTotalExpensesByUserIdAndCategoryName(
      @Param("userId") Long userId, @Param("categoryName") String categoryName);

  @Query(
      """
          SELECT new com.example.demo.dto.ExpenseCategoryMonthSummary(
              ec.name,
              CAST(SUM(e.value) AS java.math.BigDecimal)
          )
          FROM Expense e
          JOIN e.label el
          JOIN el.category ec
          WHERE e.userId = :userId
          AND ec.id = :categoryId
          AND (:year IS NULL OR YEAR(e.occurrenceDate) = :year)
          AND (:month IS NULL OR MONTH(e.occurrenceDate) = :month)
          GROUP BY ec.name
      """)
  List<ExpenseCategoryMonthSummary> getExpenseSumByUserAndCategory(
      @Param("userId") Long userId,
      @Param("year") Integer year,
      @Param("month") Integer month,
      @Param("categoryId") Long categoryId);
}
