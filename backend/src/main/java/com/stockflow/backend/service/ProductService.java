package com.stockflow.backend.service;

import com.stockflow.backend.entity.Company;
import com.stockflow.backend.entity.Product;
import com.stockflow.backend.entity.StockTransaction;
import com.stockflow.backend.repository.CompanyRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.StockTransactionRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final StockTransactionRepository transactionRepository;
    private final CompanyRepository companyRepository;

    public ProductService(
            ProductRepository productRepository,
            StockTransactionRepository transactionRepository,
            CompanyRepository companyRepository) {

        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
        this.companyRepository = companyRepository;
    }

    // Get company ID of currently logged-in user
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

    // Add product to logged-in user's company
    public Product addProduct(Product product) {

        Long companyId = getCurrentCompanyId();

        Company company = companyRepository
                .findById(companyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company not found"
                        ));

        product.setCompany(company);

        return productRepository.save(product);
    }

    // Get only products of logged-in user's company
    public List<Product> getAllProducts() {

        Long companyId = getCurrentCompanyId();

        return productRepository
                .findAllByCompanyId(companyId);
    }

    // Get one product only if it belongs to current company
    public Optional<Product> getProductById(Long id) {

        Long companyId = getCurrentCompanyId();

        return productRepository
                .findByIdAndCompanyId(id, companyId);
    }

    // Update only current company's product
    public Product updateProduct(
            Long id,
            Product updatedProduct) {

        Long companyId = getCurrentCompanyId();

        Product existingProduct =
                productRepository
                        .findByIdAndCompanyId(id, companyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        existingProduct.setName(
                updatedProduct.getName()
        );

        existingProduct.setPrice(
                updatedProduct.getPrice()
        );

        existingProduct.setQuantity(
                updatedProduct.getQuantity()
        );

        existingProduct.setDescription(
                updatedProduct.getDescription()
        );

        existingProduct.setCategory(
                updatedProduct.getCategory()
        );

        existingProduct.setSupplier(
                updatedProduct.getSupplier()
        );

        return productRepository.save(existingProduct);
    }

    // Delete only current company's product
    public void deleteProduct(Long id) {

        Long companyId = getCurrentCompanyId();

        Product product =
                productRepository
                        .findByIdAndCompanyId(id, companyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        productRepository.delete(product);
    }

    // Increase stock only for current company's product
    public Product increaseStock(
            Long id,
            Integer amount) {

        Long companyId = getCurrentCompanyId();

        Product product =
                productRepository
                        .findByIdAndCompanyId(id, companyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        if (amount == null || amount <= 0) {
            throw new RuntimeException(
                    "Stock amount must be greater than 0"
            );
        }

        product.setQuantity(
                product.getQuantity() + amount
        );

        Product savedProduct =
                productRepository.save(product);

        saveTransaction(
                savedProduct,
                "IN",
                amount
        );

        return savedProduct;
    }

    // Decrease stock only for current company's product
    public Product decreaseStock(
            Long id,
            Integer amount) {

        Long companyId = getCurrentCompanyId();

        Product product =
                productRepository
                        .findByIdAndCompanyId(id, companyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        if (amount == null || amount <= 0) {
            throw new RuntimeException(
                    "Stock amount must be greater than 0"
            );
        }

        if (product.getQuantity() < amount) {
            throw new RuntimeException(
                    "Not enough stock available"
            );
        }

        product.setQuantity(
                product.getQuantity() - amount
        );

        Product savedProduct =
                productRepository.save(product);

        saveTransaction(
                savedProduct,
                "OUT",
                amount
        );

        return savedProduct;
    }

    private void saveTransaction(
            Product product,
            String type,
            Integer quantity) {

        StockTransaction transaction =
                new StockTransaction();

        transaction.setProduct(product);
        transaction.setCompany(product.getCompany());
        transaction.setType(type);
        transaction.setQuantity(quantity);
        transaction.setCreatedAt(
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);
    }
}