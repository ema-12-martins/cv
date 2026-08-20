package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final IncomeLabelRepository incomeLabelRepository;
  private final IncomeCategoryRepository incomeCategoryRepository;
  private final ExpenseCategoryRepository expenseCategoryRepository;
  private final ExpenseLabelRepository expenseLabelRepository;

  @Autowired
  public UserService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      IncomeLabelRepository incomeLabelRepository,
      IncomeCategoryRepository incomeCategoryRepository,
      ExpenseCategoryRepository expenseCategoryRepository,
      ExpenseLabelRepository expenseLabelRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.incomeLabelRepository = incomeLabelRepository;
    this.incomeCategoryRepository = incomeCategoryRepository;
    this.expenseCategoryRepository = expenseCategoryRepository;
    this.expenseLabelRepository = expenseLabelRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository
        .findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
  }

  public User registerNewUser(User user) {
    // check if user already exists
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
      throw new RuntimeException("Email already in use");
    }

    // encode password
    user.setPasswordHash(passwordEncoder.encode(user.getPassword()));

    // set last login to current date
    user.setLastLogin(LocalDate.now());

    // set amount saved to zero
    user.setAmountSaved(BigDecimal.ZERO);

    User savedUser = userRepository.save(user);

    // Create "None" IncomeLabels
    List<IncomeCategory> incomeCategories = incomeCategoryRepository.findAll();
    for (IncomeCategory category : incomeCategories) {
      IncomeLabel label = new IncomeLabel();
      label.setUserId(savedUser.getId());
      label.setCategoryId(category.getId());
      label.setName("None");
      incomeLabelRepository.save(label);
    }

    // Create "None" ExpenseLabels
    List<ExpenseCategory> expenseCategories = expenseCategoryRepository.findAll();
    for (ExpenseCategory category : expenseCategories) {
      ExpenseLabel label = new ExpenseLabel();
      label.setUserId(savedUser.getId());
      label.setCategoryId(category.getId());
      label.setName("None");
      label.setSpent(0.0);
      label.setTarget(0.0);
      expenseLabelRepository.save(label);
    }

    return savedUser;
  }

  public void updateLastLogin(String email) {
    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isPresent()) {
      User user = userOpt.get();
      user.setLastLogin(LocalDate.now());
      userRepository.save(user);
    }
  }

  public User updateUser(String email, Map<String, Object> updates) {
    User user =
        userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

    if (updates.containsKey("name")) {
      user.setName((String) updates.get("name"));
    }
    if (updates.containsKey("mobileNumber")) {
      Object mobile = updates.get("mobileNumber");
      if (mobile instanceof String) {
        user.setMobileNumber(Long.parseLong((String) mobile));
      } else if (mobile instanceof Number) {
        user.setMobileNumber(((Number) mobile).longValue());
      }
    }
    if (updates.containsKey("birthdate")) {
      Object birthdateObj = updates.get("birthdate");
      if (birthdateObj instanceof String) {
        user.setBirthdate(LocalDate.parse((String) birthdateObj));
      }
    }
    return userRepository.save(user);
  }

  public void deleteUser(String email) {
    User user =
        userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    userRepository.delete(user);
  }

  // Merged methods from ema_nao_aguenta_mais
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public Optional<User> getUserById(Long id) {
    return userRepository.findById(id);
  }

  public User saveUser(User user) {
    return userRepository.save(user);
  }

  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }

  public BigDecimal getLastPercentageByIdOrZero(Long id) {
    return userRepository.findById(id).map(User::getLastPercentage).orElse(BigDecimal.ZERO);
  }

  public User updateLastPercentage(Long id, BigDecimal lastPercentage) {
    User user =
        userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    user.setLastPercentage(lastPercentage);
    return userRepository.save(user);
  }
}
