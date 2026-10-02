package com.stockflow.backend.repository;

import com.stockflow.backend.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockTransactionRepository
        extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findAllByCompanyIdOrderByCreatedAtDesc(
            Long companyId
    );
}