package com.stockflow.backend.repository;

import com.stockflow.backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository
        extends JpaRepository<Supplier, Long> {

    List<Supplier> findAllByStockFlowCompanyId(Long companyId);

    Optional<Supplier> findByIdAndStockFlowCompanyId(
            Long id,
            Long companyId
    );
}