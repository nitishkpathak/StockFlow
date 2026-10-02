package com.stockflow.backend.controller;

import com.stockflow.backend.entity.StockTransaction;
import com.stockflow.backend.service.StockTransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/stock-transactions")
public class StockTransactionController {

    private final StockTransactionService transactionService;

    public StockTransactionController(
            StockTransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Get stock history
    @GetMapping
    public List<StockTransaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }
}