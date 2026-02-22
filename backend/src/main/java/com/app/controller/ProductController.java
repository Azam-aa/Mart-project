package com.app.controller;

import com.app.model.Product;
import com.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;
    private final com.app.service.ProductService productService;
    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.getAllProducts(category, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin only - separate Controller usually, but keeping here for simplicity,
    // secured by SecurityConfig
    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("category") String category,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = saveImage(image);
        }

        Product product = Product.builder()
                .title(title)
                .description(description)
                .price(price)
                .category(category)
                .stock(stock)
                .imageUrl(imageUrl)
                .build();

        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("category") String category,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setTitle(title);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setStock(stock);

        if (image != null && !image.isEmpty()) {
            product.setImageUrl(saveImage(image));
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted");
    }

    private String saveImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        return "/uploads/" + filename; // Return relative path
    }
}
