package com.app.controller;

import com.app.model.Product;
import com.app.dto.ProductRequest;
import com.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public Product addProduct(@RequestBody ProductRequest request) {
        return productService.addProduct(request);
    }

    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }
}
