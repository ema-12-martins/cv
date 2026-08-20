package com.example.demo.service;

import com.example.demo.model.Award;
import com.example.demo.repository.AwardRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AwardService {
  private final AwardRepository awardRepository;

  @Autowired
  public AwardService(AwardRepository awardRepository) {
    this.awardRepository = awardRepository;
  }

  // Fetch all awards
  public List<Award> getAllAwards() {
    return awardRepository.findAll();
  }

  // Fetch awards received by a specific user
  public List<Award> getAwardsByUserId(Long userId) {
    return awardRepository.findAwardsByUserId(userId);
  }

  // Fetch awards not yet received by a specific user
  public List<Award> getUnreceivedAwardsByUserId(Long userId) {
    return awardRepository.findUnreceivedAwardsByUserId(userId);
  }
}
