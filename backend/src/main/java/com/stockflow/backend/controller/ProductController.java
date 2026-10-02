package com.stockflow.backend.controller;

import com.stockflow.backend.entity.Product;
import com.stockflow.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Add product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public Optional<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // Update product
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {
        return productService.updateProduct(id, product);
    }

    // Delete product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);

        return "Product deleted successfully";
    }

    // Increase stock
    @PostMapping("/{id}/stock/increase")
    public Product increaseStock(
            @PathVariable Long id,
            @RequestParam Integer amount
    ) {
        return productService.increaseStock(id, amount);
    }

    // Decrease stock
    @PostMapping("/{id}/stock/decrease")
    public Product decreaseStock(
            @PathVariable Long id,
            @RequestParam Integer amount
    ) {
        return productService.decreaseStock(id, amount);
    }
}