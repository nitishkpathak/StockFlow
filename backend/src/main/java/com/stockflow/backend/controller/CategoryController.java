package com.stockflow.backend.controller;

import com.stockflow.backend.entity.Category;
import com.stockflow.backend.service.CategoryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {


    // ========================================================
    // SERVICE
    // ========================================================

    private final CategoryService categoryService;


    // ========================================================
    // CONSTRUCTOR INJECTION
    // ========================================================

    public CategoryController(
            CategoryService categoryService) {

        this.categoryService =
                categoryService;
    }


    // ========================================================
    // CREATE CATEGORY
    // POST /api/categories
    // ========================================================

    @PostMapping
    public Category addCategory(
            @RequestBody Category category) {

        return categoryService.addCategory(
                category
        );
    }


    // ========================================================
    // GET ALL CATEGORIES
    // GET /api/categories
    // ========================================================

    @GetMapping
    public List<Category> getAllCategories() {

        return categoryService.getAllCategories();

    }


    // ========================================================
    // GET CATEGORY BY ID
    // GET /api/categories/{id}
    // ========================================================

    @GetMapping("/{id}")
    public Optional<Category> getCategoryById(
            @PathVariable Long id) {

        return categoryService.getCategoryById(id);

    }


    // ========================================================
    // UPDATE CATEGORY
    // PUT /api/categories/{id}
    // ========================================================

    @PutMapping("/{id}")
    public Category updateCategory(
            @PathVariable Long id,
            @RequestBody Category category) {

        return categoryService.updateCategory(
                id,
                category
        );

    }


    // ========================================================
    // DELETE CATEGORY
    // DELETE /api/categories/{id}
    // ========================================================

    @DeleteMapping("/{id}")
    public String deleteCategory(
            @PathVariable Long id) {

        categoryService.deleteCategory(id);

        return "Category deleted successfully";

    }

}