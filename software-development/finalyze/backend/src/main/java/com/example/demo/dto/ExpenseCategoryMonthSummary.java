package com.example.demo.dto;

import java.math.BigDecimal;

public class ExpenseCategoryMonthSummary {
  private String categoryName;
  private BigDecimal total;

  public ExpenseCategoryMonthSummary(String categoryName, BigDecimal total) {
    this.categoryName = categoryName;
    this.total = total;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public BigDecimal getTotal() {
    return total;
  }
}
