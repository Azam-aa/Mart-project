package com.app.service;

import com.app.model.Product;
import com.app.dto.ProductRequest;
import com.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product addProduct(ProductRequest request) {
        Product product = Product.builder()
                .title(request.getTitle())
                .price(request.getPrice())
                .category(request.getCategory())
                .build();
        return productRepository.save(product);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }
}
