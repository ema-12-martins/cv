package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "savings_target")
public class SavingsTarget {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private Long amount;

  @Column(name = "by_date", nullable = false)
  private java.time.LocalDate byDate;

  @Column(nullable = false)
  private Long priority;

  @Column(nullable = false)
  private Boolean active;

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

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getAmount() {
    return amount;
  }

  public void setAmount(Long amount) {
    this.amount = amount;
  }

  public java.time.LocalDate getByDate() {
    return byDate;
  }

  public void setByDate(java.time.LocalDate byDate) {
    this.byDate = byDate;
  }

  public Long getPriority() {
    return priority;
  }

  public void setPriority(Long priority) {
    this.priority = priority;
  }

  public Boolean getActive() {
    return active;
  }

  public void setActive(Boolean active) {
    this.active = active;
  }
}
