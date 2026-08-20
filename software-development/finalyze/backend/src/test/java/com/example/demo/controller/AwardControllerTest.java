package com.example.demo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.model.Award;
import com.example.demo.service.AwardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AwardController.class)
public class AwardControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AwardService awardService;

  @Autowired private ObjectMapper objectMapper;

  private Award award;

  @BeforeEach
  void setup() {
    award = new Award();
    award.setId(1L);
    award.setName("Top Saver");
    award.setDescription("Awarded for saving the most money.");
    award.setConditionType("amount_saved");
    award.setConditionThreshold(1000.0);
  }

  @WithMockUser
  @Test
  void testGetAllAwards_returnsList() throws Exception {
    when(awardService.getAllAwards()).thenReturn(List.of(award));

    mockMvc
        .perform(get("/api/awards").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Top Saver"));
  }

  @WithMockUser
  @Test
  void testGetAwardsByUserId_returnsList() throws Exception {
    when(awardService.getAwardsByUserId(42L)).thenReturn(List.of(award));

    mockMvc
        .perform(get("/api/awards/user/42/received").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Top Saver"));
  }

  @WithMockUser
  @Test
  void testGetUnreceivedAwardsByUserId_returnsList() throws Exception {
    when(awardService.getUnreceivedAwardsByUserId(42L)).thenReturn(List.of(award));

    mockMvc
        .perform(get("/api/awards/user/42/unreceived").with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Top Saver"));
  }
}
