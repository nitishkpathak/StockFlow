package com.stockflow.backend.repository;

import com.stockflow.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    List<Product> findAllByCompanyId(Long companyId);

    Optional<Product> findByIdAndCompanyId(
            Long id,
            Long companyId
    );
}