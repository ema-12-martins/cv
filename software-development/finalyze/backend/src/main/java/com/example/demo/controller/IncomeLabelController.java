package com.example.demo.controller;

import com.example.demo.model.IncomeLabel;
import com.example.demo.repository.IncomeLabelRepository;
import com.example.demo.service.IncomeLabelService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/income-labels")
public class IncomeLabelController {

  private final IncomeLabelService incomeLabelService;
  private final IncomeLabelRepository incomeLabelRepository;

  @Autowired
  public IncomeLabelController(
      IncomeLabelService incomeLabelService, IncomeLabelRepository incomeLabelRepository) {
    this.incomeLabelService = incomeLabelService;
    this.incomeLabelRepository = incomeLabelRepository;
  }

  @GetMapping("/user/{userId}/category/{categoryId}")
  public List<IncomeLabel> getLabelsByUserIdAndCategoryId(
      @PathVariable Long userId, @PathVariable Long categoryId) {
    return incomeLabelService.getLabelsByUserIdAndCategoryId(userId, categoryId);
  }

  @PostMapping("/user/{userId}/category/{categoryId}")
  public ResponseEntity<IncomeLabel> createLabel(
      @PathVariable Long userId,
      @PathVariable Long categoryId,
      @Valid @RequestBody IncomeLabel labelRequest) {

    IncomeLabel label = new IncomeLabel();
    label.setUserId(userId);
    label.setCategoryId(categoryId);
    label.setName(labelRequest.getName());

    IncomeLabel saved = incomeLabelRepository.save(label);
    return ResponseEntity.ok(saved);
  }
}
