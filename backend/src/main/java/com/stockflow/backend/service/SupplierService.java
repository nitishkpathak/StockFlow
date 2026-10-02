package com.stockflow.backend.service;

import com.stockflow.backend.entity.Company;
import com.stockflow.backend.entity.Supplier;
import com.stockflow.backend.repository.CompanyRepository;
import com.stockflow.backend.repository.SupplierRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final CompanyRepository companyRepository;

    public SupplierService(
            SupplierRepository supplierRepository,
            CompanyRepository companyRepository) {

        this.supplierRepository = supplierRepository;
        this.companyRepository = companyRepository;
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

    public Supplier addSupplier(Supplier supplier) {

        Long companyId = getCurrentCompanyId();

        Company company = companyRepository
                .findById(companyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company not found"
                        ));

        supplier.setStockFlowCompany(company);

        return supplierRepository.save(supplier);
    }

    public List<Supplier> getAllSuppliers() {

        Long companyId = getCurrentCompanyId();

        return supplierRepository
                .findAllByStockFlowCompanyId(companyId);
    }

    public Optional<Supplier> getSupplierById(Long id) {

        Long companyId = getCurrentCompanyId();

        return supplierRepository
                .findByIdAndStockFlowCompanyId(
                        id,
                        companyId
                );
    }

    public Supplier updateSupplier(
            Long id,
            Supplier updatedSupplier) {

        Long companyId = getCurrentCompanyId();

        Supplier existingSupplier =
                supplierRepository
                        .findByIdAndStockFlowCompanyId(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier not found"
                                ));

        existingSupplier.setName(
                updatedSupplier.getName()
        );

        existingSupplier.setCompany(
                updatedSupplier.getCompany()
        );

        existingSupplier.setEmail(
                updatedSupplier.getEmail()
        );

        existingSupplier.setPhone(
                updatedSupplier.getPhone()
        );

        existingSupplier.setAddress(
                updatedSupplier.getAddress()
        );

        return supplierRepository.save(
                existingSupplier
        );
    }

    public void deleteSupplier(Long id) {

        Long companyId = getCurrentCompanyId();

        Supplier supplier =
                supplierRepository
                        .findByIdAndStockFlowCompanyId(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier not found"
                                ));

        supplierRepository.delete(supplier);
    }
}