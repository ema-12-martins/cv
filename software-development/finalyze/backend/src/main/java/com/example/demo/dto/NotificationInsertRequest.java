package com.example.demo.dto;

import java.time.LocalDateTime;

public class NotificationInsertRequest {
  private Long userId;
  private LocalDateTime notificationDate;
  private String title;
  private String text;

  // Getters e Setters

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public LocalDateTime getNotificationDate() {
    return notificationDate;
  }

  public void setNotificationDate(LocalDateTime notificationDate) {
    this.notificationDate = notificationDate;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }
}
