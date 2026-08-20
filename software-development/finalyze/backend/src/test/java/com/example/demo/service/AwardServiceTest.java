package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.demo.model.Award;
import com.example.demo.repository.AwardRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class AwardServiceTest {

  private AwardRepository awardRepository;
  private AwardService awardService;

  @BeforeEach
  void setUp() {
    awardRepository = mock(AwardRepository.class);
    awardService = new AwardService(awardRepository);
  }

  @Test
  void testGetAllAwards_returnsAllAwards() {
    List<Award> mockAwards = List.of(new Award(), new Award());
    when(awardRepository.findAll()).thenReturn(mockAwards);

    List<Award> result = awardService.getAllAwards();

    assertEquals(2, result.size());
    verify(awardRepository).findAll();
  }

  @Test
  void testGetAwardsByUserId_returnsUserAwards() {
    Long userId = 1L;
    List<Award> mockAwards = List.of(new Award());
    when(awardRepository.findAwardsByUserId(userId)).thenReturn(mockAwards);

    List<Award> result = awardService.getAwardsByUserId(userId);

    assertEquals(1, result.size());
    verify(awardRepository).findAwardsByUserId(userId);
  }

  @Test
  void testGetUnreceivedAwardsByUserId_returnsUnreceivedAwards() {
    Long userId = 1L;
    List<Award> mockAwards = List.of(new Award(), new Award(), new Award());
    when(awardRepository.findUnreceivedAwardsByUserId(userId)).thenReturn(mockAwards);

    List<Award> result = awardService.getUnreceivedAwardsByUserId(userId);

    assertEquals(3, result.size());
    verify(awardRepository).findUnreceivedAwardsByUserId(userId);
  }
}
