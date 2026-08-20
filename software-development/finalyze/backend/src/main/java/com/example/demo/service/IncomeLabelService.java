package com.example.demo.service;

import com.example.demo.model.IncomeLabel;
import com.example.demo.repository.IncomeLabelRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IncomeLabelService {

  private final IncomeLabelRepository incomeLabelRepository;

  @Autowired
  public IncomeLabelService(IncomeLabelRepository incomeLabelRepository) {
    this.incomeLabelRepository = incomeLabelRepository;
  }

  public List<IncomeLabel> getLabelsByUserIdAndCategoryId(Long userId, Long categoryId) {
    return incomeLabelRepository.findByUserIdAndCategoryId(userId, categoryId);
  }
}
