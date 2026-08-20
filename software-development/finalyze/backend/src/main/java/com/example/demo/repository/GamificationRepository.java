package com.example.demo.repository;

import com.example.demo.model.Gamification;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GamificationRepository extends JpaRepository<Gamification, Long> {
  Optional<Gamification> findByUserId(Long userId);
}
