package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.dto.NotificationInsertRequest;
import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NotificationServiceTest {

  private NotificationRepository notificationRepository;
  private NotificationService notificationService;

  @BeforeEach
  void setUp() {
    notificationRepository = mock(NotificationRepository.class);
    notificationService = new NotificationService(notificationRepository);
  }

  @Test
  void getNotificationsByUser_returnsNotifications() {
    Notification n1 = new Notification();
    n1.setUserId(1L);
    Notification n2 = new Notification();
    n2.setUserId(1L);

    when(notificationRepository.findByUserId(1L)).thenReturn(List.of(n1, n2));

    List<Notification> result = notificationService.getNotificationsByUser(1L);

    assertEquals(2, result.size());
    verify(notificationRepository).findByUserId(1L);
  }

  @Test
  void createNotification_savesAndReturnsNotification() {
    NotificationInsertRequest request = new NotificationInsertRequest();
    request.setUserId(10L);
    request.setNotificationDate(LocalDateTime.now());
    request.setTitle("Title");
    request.setText("Text");

    Notification saved = new Notification();
    saved.setUserId(request.getUserId());
    saved.setNotificationDate(request.getNotificationDate());
    saved.setTitle(request.getTitle());
    saved.setText(request.getText());
    saved.setRead(false);

    when(notificationRepository.save(any())).thenReturn(saved);

    Notification result = notificationService.createNotification(request);

    assertNotNull(result);
    assertEquals(10L, result.getUserId());
    assertEquals("Title", result.getTitle());
    assertEquals("Text", result.getText());
    assertFalse(result.getRead());
    verify(notificationRepository).save(any(Notification.class));
  }

  @Test
  void deleteNotification_callsRepository() {
    notificationService.deleteNotification(5L);
    verify(notificationRepository).deleteById(5L);
  }

  @Test
  void markAllNotificationsAsRead_callsRepository() {
    notificationService.markAllNotificationsAsRead(7L);
    verify(notificationRepository).markAllAsReadByUserId(7L);
  }

  @Test
  void countUnreadNotifications_returnsCorrectCount() {
    when(notificationRepository.countUnreadByUserId(3L)).thenReturn(4L);

    long result = notificationService.countUnreadNotifications(3L);

    assertEquals(4L, result);
    verify(notificationRepository).countUnreadByUserId(3L);
  }
}
