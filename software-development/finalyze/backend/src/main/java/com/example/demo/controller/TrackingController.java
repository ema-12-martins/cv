package com.example.demo.controller;

import com.example.demo.dto.TrackingEntriesRequest;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.IncomeRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

  private final IncomeRepository incomeRepository;
  private final ExpenseRepository expenseRepository;

  public TrackingController(
      IncomeRepository incomeRepository, ExpenseRepository expenseRepository) {
    this.incomeRepository = incomeRepository;
    this.expenseRepository = expenseRepository;
  }

  @GetMapping
  public ResponseEntity<List<TrackingEntriesRequest>> getTrackingEntries(
      @RequestParam Long userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "date") String sortBy,
      @RequestParam(defaultValue = "desc") String sortOrder) {

    List<TrackingEntriesRequest> incomeEntries =
        incomeRepository.findByUserId(userId).stream()
            .map(
                income ->
                    new TrackingEntriesRequest(
                        income.getId(),
                        income.getValue(),
                        income.getLabel().getName(),
                        income.getLabel().getCategory().getName(),
                        income.getOccurrenceDate(),
                        "income"))
            .toList();

    List<TrackingEntriesRequest> expenseEntries =
        expenseRepository.findByUserId(userId).stream()
            .map(
                expense ->
                    new TrackingEntriesRequest(
                        expense.getId(),
                        expense.getValue(),
                        expense.getLabel().getName(),
                        expense.getLabel().getCategory().getName(),
                        expense.getOccurrenceDate(),
                        "expense"))
            .toList();
    System.out.println(incomeEntries);

    // Merge entries
    List<TrackingEntriesRequest> combined = new ArrayList<>();
    combined.addAll(incomeEntries);
    combined.addAll(expenseEntries);

    // Sort based on sortBy and sortOrder parameters
    Comparator<TrackingEntriesRequest> comparator;
    switch (sortBy.toLowerCase()) {
      case "amount":
        comparator = Comparator.comparing((TrackingEntriesRequest entry) -> entry.getValue().abs());
        break;
      case "date":
      default:
        comparator = Comparator.comparing(TrackingEntriesRequest::getOccurrenceDate);
        break;
    }

    // Apply sort order (ascending or descending)
    if ("desc".equalsIgnoreCase(sortOrder)) {
      comparator = comparator.reversed();
    }

    combined.sort(comparator);

    // Paginate manually
    int fromIndex = page * size;
    int toIndex = Math.min(fromIndex + size, combined.size());
    if (fromIndex > combined.size()) {
      return ResponseEntity.ok(Collections.emptyList());
    }

    return ResponseEntity.ok(combined.subList(fromIndex, toIndex));
  }

  @GetMapping("/pdf")
  public ResponseEntity<byte[]> getTrackingEntriesPdf(
      @RequestParam Long userId,
      @RequestParam(defaultValue = "date") String sortBy,
      @RequestParam(defaultValue = "desc") String sortOrder)
      throws DocumentException, IOException {
    List<TrackingEntriesRequest> incomeEntries =
        incomeRepository.findByUserId(userId).stream()
            .map(
                income ->
                    new TrackingEntriesRequest(
                        income.getId(),
                        income.getValue(),
                        income.getLabel().getName(),
                        income.getLabel().getCategory().getName(),
                        income.getOccurrenceDate(),
                        "income"))
            .toList();

    List<TrackingEntriesRequest> expenseEntries =
        expenseRepository.findByUserId(userId).stream()
            .map(
                expense ->
                    new TrackingEntriesRequest(
                        expense.getId(),
                        expense.getValue(),
                        expense.getLabel().getName(),
                        expense.getLabel().getCategory().getName(),
                        expense.getOccurrenceDate(),
                        "expense"))
            .toList();

    List<TrackingEntriesRequest> combined = new ArrayList<>();
    combined.addAll(incomeEntries);
    combined.addAll(expenseEntries);

    // Sort based on sortBy and sortOrder parameters
    Comparator<TrackingEntriesRequest> comparator;
    switch (sortBy.toLowerCase()) {
      case "amount":
        comparator = Comparator.comparing((TrackingEntriesRequest entry) -> entry.getValue().abs());
        break;
      case "date":
      default:
        comparator = Comparator.comparing(TrackingEntriesRequest::getOccurrenceDate);
        break;
    }

    // Apply sort order (ascending or descending)
    if ("desc".equalsIgnoreCase(sortOrder)) {
      comparator = comparator.reversed();
    }

    combined.sort(comparator);

    Document document = new Document();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PdfWriter.getInstance(document, baos);

    document.open();
    for (TrackingEntriesRequest entry : combined) {
      document.add(
          new Paragraph(
              String.format(
                  "Type: %s, Value: %.2f, Label: %s, Category: %s, Date: %s",
                  entry.getType(),
                  entry.getValue(),
                  entry.getLabel(),
                  entry.getCategory(),
                  entry.getOccurrenceDate())));
    }
    document.close();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    String filename = "tracking_entries.pdf";
    headers.setContentDispositionFormData("attachment", filename);
    headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

    return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
  }
}
