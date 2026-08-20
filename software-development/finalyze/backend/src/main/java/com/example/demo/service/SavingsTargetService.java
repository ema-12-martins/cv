package com.example.demo.service;

import com.example.demo.model.SavingsTarget;
import com.example.demo.repository.SavingsTargetRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SavingsTargetService {
  private final SavingsTargetRepository savingsTargetRepository;

  @Autowired
  public SavingsTargetService(SavingsTargetRepository savingsTargetRepository) {
    this.savingsTargetRepository = savingsTargetRepository;
  }

  public Optional<SavingsTarget> getHighestPrioritySavingsTarget(Long userId) {
    return savingsTargetRepository.findHighestPriorityByUserId(userId);
  }

  public SavingsTarget saveSavingsTarget(SavingsTarget savingsTarget) {
    return savingsTargetRepository.save(savingsTarget);
  }

  public long countSavingsTargets() {
    return savingsTargetRepository.count();
  }

  public long countSavingsTargetsByUserId(Long userId) {
    return savingsTargetRepository.countByUserId(userId);
  }

  public List<SavingsTarget> getAllByUserId(Long userId) {
    return savingsTargetRepository.findAllByUserId(userId);
  }

  public Optional<SavingsTarget> getById(Long id) {
    return savingsTargetRepository.findById(id);
  }
}
