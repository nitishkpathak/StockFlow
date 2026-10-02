package com.stockflow.backend.repository;

import com.stockflow.backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository
        extends JpaRepository<Company, Long> {
}