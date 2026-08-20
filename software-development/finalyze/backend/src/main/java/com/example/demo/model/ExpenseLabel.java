package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "expense_label")
public class ExpenseLabel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "category_id", nullable = false)
  private Long categoryId;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "target", nullable = false)
  private Double target;

  @Column(name = "spent", nullable = false)
  private Double spent;

  @ManyToOne
  @JoinColumn(
      name = "category_id",
      referencedColumnName = "id",
      insertable = false,
      updatable = false)
  private ExpenseCategory category;

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Double getTarget() {
    return target;
  }

  public void setTarget(Double target) {
    this.target = target;
  }

  public Double getSpent() {
    return spent;
  }

  public void setSpent(Double spent) {
    this.spent = spent;
  }

  public ExpenseCategory getCategory() {
    return category;
  }
}
