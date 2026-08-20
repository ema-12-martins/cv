package com.example.demo.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "expense_target")
@IdClass(ExpenseTarget.ExpenseTargetId.class)
public class ExpenseTarget {

  @Id
  @Column(name = "expense_category_id")
  private Long expenseCategoryId;

  @Id
  @Column(name = "user_id")
  private Long userId;

  @Column(nullable = false)
  private Long target;

  public static class ExpenseTargetId implements Serializable {
    private Long expenseCategoryId;
    private Long userId;

    public ExpenseTargetId() {}

    public ExpenseTargetId(Long expenseCategoryId, Long userId) {
      this.expenseCategoryId = expenseCategoryId;
      this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;
      ExpenseTargetId that = (ExpenseTargetId) o;
      return expenseCategoryId.equals(that.expenseCategoryId) && userId.equals(that.userId);
    }

    @Override
    public int hashCode() {
      return expenseCategoryId.hashCode() + userId.hashCode();
    }
  }

  // Getters and setters
  public Long getExpenseCategoryId() {
    return expenseCategoryId;
  }

  public void setExpenseCategoryId(Long expenseCategoryId) {
    this.expenseCategoryId = expenseCategoryId;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Long getTarget() {
    return target;
  }

  public void setTarget(Long target) {
    this.target = target;
  }
}
