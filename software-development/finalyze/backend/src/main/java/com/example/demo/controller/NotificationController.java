package com.example.demo.controller;

import com.example.demo.dto.NotificationInsertRequest;
import com.example.demo.dto.NotificationResponse;
import com.example.demo.model.Notification;
import com.example.demo.service.NotificationService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

  @Autowired private NotificationService notificationService;

  @GetMapping("/user/{userId}")
  public List<NotificationResponse> getNotificationsByUser(@PathVariable Long userId) {
    List<Notification> notifications = notificationService.getNotificationsByUser(userId);
    return notifications.stream()
        .map(
            n ->
                new NotificationResponse(
                    n.getId(), n.getUserId(), n.getNotificationDate(), n.getTitle(), n.getText()))
        .collect(Collectors.toList());
  }

  @PostMapping
  public ResponseEntity<Notification> createNotification(
      @RequestBody NotificationInsertRequest request) {
    Notification notification = notificationService.createNotification(request);
    return new ResponseEntity<>(notification, HttpStatus.CREATED);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
    notificationService.deleteNotification(id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/user/{userId}/mark-all-read")
  public ResponseEntity<Void> markAllNotificationsAsRead(@PathVariable Long userId) {
    notificationService.markAllNotificationsAsRead(userId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/user/{userId}/unread/count")
  public ResponseEntity<Long> countUnreadNotifications(@PathVariable Long userId) {
    long count = notificationService.countUnreadNotifications(userId);
    return ResponseEntity.ok(count);
  }
}
