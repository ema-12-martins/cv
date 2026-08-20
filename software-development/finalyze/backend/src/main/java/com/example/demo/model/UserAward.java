package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class UserAward {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "award_id")
  private Award award;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  private Boolean received;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Award getAward() {
    return award;
  }

  public void setAward(Award award) {
    this.award = award;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Boolean getReceived() {
    return received;
  }

  public void setReceived(Boolean received) {
    this.received = received;
  }
}
