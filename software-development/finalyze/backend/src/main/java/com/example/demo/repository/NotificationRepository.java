package com.example.demo.repository;

import com.example.demo.model.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
  List<Notification> findByUserId(Long userId);

  @Modifying
  @Transactional
  @Query("UPDATE Notification n SET n.read = true WHERE n.userId = :userId")
  void markAllAsReadByUserId(Long userId);

  @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.read = false")
  long countUnreadByUserId(Long userId);
}
