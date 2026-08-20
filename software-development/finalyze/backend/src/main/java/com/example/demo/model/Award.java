package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "awards")
public class Award {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String description;
  private String conditionType;
  private Double conditionThreshold;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getConditionType() {
    return conditionType;
  }

  public void setConditionType(String conditionType) {
    this.conditionType = conditionType;
  }

  public Double getConditionThreshold() {
    return conditionThreshold;
  }

  public void setConditionThreshold(Double conditionThreshold) {
    this.conditionThreshold = conditionThreshold;
  }
}
