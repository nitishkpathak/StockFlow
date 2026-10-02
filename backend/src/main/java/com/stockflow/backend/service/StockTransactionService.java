package com.stockflow.backend.service;

import com.stockflow.backend.entity.StockTransaction;
import com.stockflow.backend.repository.StockTransactionRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockTransactionService {

    private final StockTransactionRepository transactionRepository;

    public StockTransactionService(
            StockTransactionRepository transactionRepository) {

        this.transactionRepository = transactionRepository;
    }

    private Long getCurrentCompanyId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                authentication.getCredentials() == null) {

            throw new RuntimeException(
                    "Company information not found"
            );
        }

        return (Long) authentication.getCredentials();
    }

    public List<StockTransaction> getAllTransactions() {

        Long companyId = getCurrentCompanyId();

        return transactionRepository
                .findAllByCompanyIdOrderByCreatedAtDesc(
                        companyId
                );
    }
}