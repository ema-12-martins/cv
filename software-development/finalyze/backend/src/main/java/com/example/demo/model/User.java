package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "\"user\"")
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String email;

  @Column(name = "mobile_number")
  private Long mobileNumber;

  private LocalDate birthdate;

  @Column(name = "password_hash")
  private String passwordHash;

  @Column(name = "last_login")
  private LocalDate lastLogin;

  @Column(name = "amount_saved", precision = 8, scale = 2)
  private BigDecimal amountSaved;

  @Column(name = "last_percentage", precision = 8, scale = 2, nullable = true)
  private BigDecimal lastPercentage;

  public User() {}

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Long getMobileNumber() {
    return mobileNumber;
  }

  public void setMobileNumber(Long mobileNumber) {
    this.mobileNumber = mobileNumber;
  }

  public LocalDate getBirthdate() {
    return birthdate;
  }

  public void setBirthdate(LocalDate birthdate) {
    this.birthdate = birthdate;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  // public void setPassword(String password) { // this is temporary
  //   this.passwordHash = password;
  // }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public LocalDate getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(LocalDate lastLogin) {
    this.lastLogin = lastLogin;
  }

  public BigDecimal getAmountSaved() {
    return amountSaved;
  }

  public void setAmountSaved(BigDecimal amountSaved) {
    this.amountSaved = amountSaved;
  }

  public BigDecimal getLastPercentage() {
    return lastPercentage;
  }

  public void setLastPercentage(BigDecimal lastPercentage) {
    this.lastPercentage = lastPercentage;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
  }

  @Override
  public String getPassword() {
    return this.passwordHash;
  }

  @Override
  public String getUsername() {
    return this.email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
