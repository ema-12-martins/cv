package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "income_label")
public class IncomeLabel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull(message = "User ID cannot be null")
  private Long userId;

  @Column(name = "category_id", nullable = false)
  @NotNull(message = "Category ID cannot be null")
  private Long categoryId;

  @NotBlank(message = "Name is mandatory")
  private String name;

  @ManyToOne
  @JoinColumn(
      name = "category_id",
      referencedColumnName = "id",
      insertable = false,
      updatable = false)
  private IncomeCategory category;

  public IncomeLabel() {}

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

  public IncomeCategory getCategory() {
    return category;
  }
}
