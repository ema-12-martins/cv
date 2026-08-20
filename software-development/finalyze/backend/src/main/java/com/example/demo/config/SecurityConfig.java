package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(
            auth -> auth.requestMatchers("/api/auth/**").permitAll().anyRequest().authenticated())
        .formLogin(form -> form.disable());

    return http.build();
  }

  // comment the above function and uncomment this one in order to have unauthenticated access to
  // the application
  // @Bean
  // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  //     http.csrf().disable()
  //         .authorizeHttpRequests((requests) ->
  //             requests.anyRequest().permitAll())  // Allow all requests without authentication
  //         .formLogin().disable()  // Disable form login (if you don't want any login page)
  //         .logout().disable();    // Disable logout functionality (if you don't need it for now)

  //     return http.build();
  // }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
