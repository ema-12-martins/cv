package com.example.demo.repository;

import com.example.demo.model.Award;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AwardRepository extends JpaRepository<Award, Long> {
  // Fetch all awards
  List<Award> findAll();

  // Fetch awards received by a specific user
  @Query("SELECT ua.award FROM UserAward ua WHERE ua.user.id = :userId AND ua.received = true")
  List<Award> findAwardsByUserId(Long userId);

  // Fetch awards not yet received by a specific user
  @Query(
      "SELECT a FROM Award a WHERE a.id NOT IN (SELECT ua.award.id FROM UserAward ua WHERE"
          + " ua.user.id = :userId AND ua.received = true)")
  List<Award> findUnreceivedAwardsByUserId(Long userId);
}
