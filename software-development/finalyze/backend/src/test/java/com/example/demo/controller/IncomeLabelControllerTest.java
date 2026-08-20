package com.example.demo.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.demo.model.IncomeLabel;
import com.example.demo.repository.IncomeLabelRepository;
import com.example.demo.service.IncomeLabelService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(IncomeLabelController.class)
public class IncomeLabelControllerTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @MockBean private IncomeLabelService incomeLabelService;

  @MockBean private IncomeLabelRepository incomeLabelRepository;

  @WithMockUser(username = "test")
  @Test
  public void testGetLabelsByUserIdAndCategoryId_returnsLabels() throws Exception {
    IncomeLabel label = new IncomeLabel();
    label.setId(1L);
    label.setUserId(1L);
    label.setCategoryId(1L);
    label.setName("Salary");

    Mockito.when(incomeLabelService.getLabelsByUserIdAndCategoryId(1L, 1L))
        .thenReturn(List.of(label));

    mockMvc
        .perform(get("/api/income-labels/user/1/category/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].name").value("Salary"));
  }

  @WithMockUser(username = "test")
  @Test
  public void testGetLabelsByUserIdAndCategoryId_returnsEmptyList() throws Exception {
    Mockito.when(incomeLabelService.getLabelsByUserIdAndCategoryId(2L, 3L))
        .thenReturn(Collections.emptyList());

    mockMvc
        .perform(get("/api/income-labels/user/2/category/3"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(0)));
  }

  @WithMockUser(username = "test")
  @Test
  public void testCreateLabel_validInput_returnsCreatedLabel() throws Exception {
    IncomeLabel request = new IncomeLabel();
    request.setName("Gift");
    request.setUserId(5L);
    request.setCategoryId(6L);

    IncomeLabel saved = new IncomeLabel();
    saved.setId(10L);
    saved.setUserId(5L);
    saved.setCategoryId(6L);
    saved.setName("Gift");

    Mockito.when(incomeLabelRepository.save(any(IncomeLabel.class))).thenReturn(saved);

    mockMvc
        .perform(
            post("/api/income-labels/user/5/category/6")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(10))
        .andExpect(jsonPath("$.userId").value(5))
        .andExpect(jsonPath("$.categoryId").value(6))
        .andExpect(jsonPath("$.name").value("Gift"));
  }

  @WithMockUser(username = "test")
  @Test
  public void testCreateLabel_missingName_returnsBadRequest() throws Exception {
    IncomeLabel request = new IncomeLabel(); // no name

    mockMvc
        .perform(
            post("/api/income-labels/user/1/category/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest());
  }

  /* NOT SURE IF WE'LL DEAL WITH EXCEPTIONS ON THE SERVICES
  @WithMockUser(username = "test")
  @Test
  public void testCreateLabel_serviceThrows_returnsServerError() throws Exception {
      IncomeLabel request = new IncomeLabel();
      request.setName("Bonus");
      request.setCategoryId(1L);
      request.setUserId(1L);


      Mockito.when(incomeLabelRepository.save(any(IncomeLabel.class)))
              .thenThrow(new RuntimeException("Unexpected failure"));

      mockMvc.perform(post("/api/income-labels/user/1/category/1")
                      .with(csrf())
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(objectMapper.writeValueAsString(request)))
              .andExpect(status().isInternalServerError());
  }
  */

}
