package com.example.demo.dto;

public class ExpenseSummaryRequest {
  private Long userId;
  private Integer year;
  private Integer month;
  private Long categoryId; // Opcional

  public ExpenseSummaryRequest() {}

  public ExpenseSummaryRequest(Long userId, Integer year, Integer month) {
    this.userId = userId;
    this.year = year;
    this.month = month;
  }

  public ExpenseSummaryRequest(Long userId, Integer year, Integer month, Long categoryId) {
    this.userId = userId;
    this.year = year;
    this.month = month;
    this.categoryId = categoryId;
  }

  // Getters & setters
  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Integer getYear() {
    return year;
  }

  public void setYear(Integer year) {
    this.year = year;
  }

  public Integer getMonth() {
    return month;
  }

  public void setMonth(Integer month) {
    this.month = month;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }
}
