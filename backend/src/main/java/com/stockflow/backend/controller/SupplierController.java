package com.stockflow.backend.controller;

import com.stockflow.backend.entity.Supplier;
import com.stockflow.backend.service.SupplierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(
            SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // Add supplier
    @PostMapping
    public Supplier addSupplier(
            @RequestBody Supplier supplier) {

        return supplierService.addSupplier(supplier);
    }

    // Get all suppliers
    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    // Get supplier by ID
    @GetMapping("/{id}")
    public Optional<Supplier> getSupplierById(
            @PathVariable Long id) {

        return supplierService.getSupplierById(id);
    }

    // Update supplier
    @PutMapping("/{id}")
    public Supplier updateSupplier(
            @PathVariable Long id,
            @RequestBody Supplier supplier) {

        return supplierService.updateSupplier(
                id,
                supplier
        );
    }

    // Delete supplier
    @DeleteMapping("/{id}")
    public String deleteSupplier(
            @PathVariable Long id) {

        supplierService.deleteSupplier(id);

        return "Supplier deleted successfully";
    }
}