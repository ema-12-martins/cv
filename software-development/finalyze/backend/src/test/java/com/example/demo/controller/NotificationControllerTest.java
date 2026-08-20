package com.example.demo.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.dto.NotificationInsertRequest;
import com.example.demo.model.Notification;
import com.example.demo.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(NotificationController.class)
public class NotificationControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private NotificationService notificationService;

  @Autowired private ObjectMapper objectMapper;

  private Notification notification1;
  private Notification notification2;

  @BeforeEach
  void setup() {
    notification1 = new Notification();
    notification1.setId(1L);
    notification1.setUserId(42L);
    notification1.setNotificationDate(LocalDateTime.of(2025, 5, 30, 10, 0));
    notification1.setTitle("Title1");
    notification1.setText("Text1");
    notification1.setRead(false);

    notification2 = new Notification();
    notification2.setId(2L);
    notification2.setUserId(42L);
    notification2.setNotificationDate(LocalDateTime.of(2025, 5, 29, 15, 30));
    notification2.setTitle("Title2");
    notification2.setText("Text2");
    notification2.setRead(true);
  }

  @WithMockUser(username = "test")
  @Test
  void testGetNotificationsByUser_returnsMappedList() throws Exception {
    List<Notification> list = List.of(notification1, notification2);
    when(notificationService.getNotificationsByUser(42L)).thenReturn(list);

    mockMvc
        .perform(get("/api/notifications/user/42"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].userId").value(42))
        .andExpect(jsonPath("$[0].notificationDate").value("2025-05-30T10:00:00"))
        .andExpect(jsonPath("$[0].title").value("Title1"))
        .andExpect(jsonPath("$[0].text").value("Text1"))
        .andExpect(jsonPath("$[1].id").value(2))
        .andExpect(jsonPath("$[1].userId").value(42))
        .andExpect(jsonPath("$[1].notificationDate").value("2025-05-29T15:30:00"))
        .andExpect(jsonPath("$[1].title").value("Title2"))
        .andExpect(jsonPath("$[1].text").value("Text2"));
  }

  @WithMockUser(username = "test")
  @Test
  void testCreateNotification_returnsCreatedNotification() throws Exception {
    NotificationInsertRequest request = new NotificationInsertRequest();
    request.setUserId(42L);
    request.setNotificationDate(LocalDateTime.of(2025, 5, 30, 10, 0));
    request.setTitle("New Title");
    request.setText("New Text");

    Notification savedNotification = new Notification();
    savedNotification.setId(99L);
    savedNotification.setUserId(request.getUserId());
    savedNotification.setNotificationDate(request.getNotificationDate());
    savedNotification.setTitle(request.getTitle());
    savedNotification.setText(request.getText());
    savedNotification.setRead(false);

    when(notificationService.createNotification(any(NotificationInsertRequest.class)))
        .thenReturn(savedNotification);

    mockMvc
        .perform(
            post("/api/notifications")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(99))
        .andExpect(jsonPath("$.userId").value(42))
        .andExpect(jsonPath("$.notificationDate").value("2025-05-30T10:00:00"))
        .andExpect(jsonPath("$.title").value("New Title"))
        .andExpect(jsonPath("$.text").value("New Text"))
        .andExpect(
            jsonPath("$.read")
                .value(false)); // read is not serialized in DTO, so it's not expected in JSON
  }

  @WithMockUser(username = "test")
  @Test
  void testDeleteNotification_returnsNoContent() throws Exception {
    doNothing().when(notificationService).deleteNotification(1L);

    mockMvc.perform(delete("/api/notifications/1").with(csrf())).andExpect(status().isNoContent());

    verify(notificationService, times(1)).deleteNotification(1L);
  }

  @WithMockUser(username = "test")
  @Test
  void testMarkAllNotificationsAsRead_returnsNoContent() throws Exception {
    doNothing().when(notificationService).markAllNotificationsAsRead(42L);

    mockMvc
        .perform(put("/api/notifications/user/42/mark-all-read").with(csrf()))
        .andExpect(status().isNoContent());

    verify(notificationService, times(1)).markAllNotificationsAsRead(42L);
  }

  @WithMockUser(username = "test")
  @Test
  void testCountUnreadNotifications_returnsCount() throws Exception {
    when(notificationService.countUnreadNotifications(42L)).thenReturn(5L);

    mockMvc
        .perform(get("/api/notifications/user/42/unread/count"))
        .andExpect(status().isOk())
        .andExpect(content().string("5"));
  }
}
