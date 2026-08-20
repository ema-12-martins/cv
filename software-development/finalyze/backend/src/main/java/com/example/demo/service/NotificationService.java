package com.example.demo.service;

import com.example.demo.dto.NotificationInsertRequest;
import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

  private final NotificationRepository notificationRepository;

  @Autowired
  public NotificationService(NotificationRepository notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  public List<Notification> getNotificationsByUser(Long userId) {
    return notificationRepository.findByUserId(userId);
  }

  public Notification createNotification(NotificationInsertRequest request) {
    Notification notification = new Notification();
    notification.setUserId(request.getUserId());
    notification.setNotificationDate(request.getNotificationDate());
    notification.setTitle(request.getTitle());
    notification.setText(request.getText());
    notification.setRead(false);
    return notificationRepository.save(notification);
  }

  public void deleteNotification(Long id) {
    notificationRepository.deleteById(id);
  }

  public void markAllNotificationsAsRead(Long userId) {
    notificationRepository.markAllAsReadByUserId(userId);
  }

  public long countUnreadNotifications(Long userId) {
    return notificationRepository.countUnreadByUserId(userId);
  }
}
