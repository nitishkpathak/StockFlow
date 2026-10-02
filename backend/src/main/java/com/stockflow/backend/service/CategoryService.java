package com.stockflow.backend.service;

import com.stockflow.backend.entity.Category;
import com.stockflow.backend.entity.Company;
import com.stockflow.backend.repository.CategoryRepository;
import com.stockflow.backend.repository.CompanyRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CompanyRepository companyRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            CompanyRepository companyRepository) {

        this.categoryRepository = categoryRepository;
        this.companyRepository = companyRepository;
    }

    // Get company ID of logged-in user
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

    // Add category to current company
    public Category addCategory(Category category) {

        Long companyId = getCurrentCompanyId();

        Company company = companyRepository
                .findById(companyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company not found"
                        ));

        category.setCompany(company);

        return categoryRepository.save(category);
    }

    // Get only current company's categories
    public List<Category> getAllCategories() {

        Long companyId = getCurrentCompanyId();

        return categoryRepository
                .findAllByCompanyId(companyId);
    }

    // Get category only if it belongs to current company
    public Optional<Category> getCategoryById(Long id) {

        Long companyId = getCurrentCompanyId();

        return categoryRepository
                .findByIdAndCompanyId(id, companyId);
    }

    // Update only current company's category
    public Category updateCategory(
            Long id,
            Category updatedCategory) {

        Long companyId = getCurrentCompanyId();

        Category existingCategory =
                categoryRepository
                        .findByIdAndCompanyId(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found"
                                ));

        existingCategory.setName(
                updatedCategory.getName()
        );

        existingCategory.setDescription(
                updatedCategory.getDescription()
        );

        return categoryRepository.save(
                existingCategory
        );
    }

    // Delete only current company's category
    public void deleteCategory(Long id) {

        Long companyId = getCurrentCompanyId();

        Category category =
                categoryRepository
                        .findByIdAndCompanyId(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found"
                                ));

        categoryRepository.delete(category);
    }
}