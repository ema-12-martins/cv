package com.example.demo.dto;

import java.time.LocalDateTime;

public class NotificationResponse {
  private Long id;
  private Long userId;
  private LocalDateTime notificationDate;
  private String title;
  private String text;

  public NotificationResponse(
      Long id, Long userId, LocalDateTime notificationDate, String title, String text) {
    this.id = id;
    this.userId = userId;
    this.notificationDate = notificationDate;
    this.title = title;
    this.text = text;
  }

  // Getters (pode incluir setters se precisar)

  public Long getId() {
    return id;
  }

  public Long getUserId() {
    return userId;
  }

  public LocalDateTime getNotificationDate() {
    return notificationDate;
  }

  public String getTitle() {
    return title;
  }

  public String getText() {
    return text;
  }
}
