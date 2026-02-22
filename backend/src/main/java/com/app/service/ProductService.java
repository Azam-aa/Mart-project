package com.app.service;

import com.app.dto.ProductDto;
import com.app.model.Product;
import com.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    public Page<Product> getAllProducts(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (category != null && !category.equals("All")) {
            return productRepository.findByCategory(category, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product addProduct(ProductDto productDto) {
        return null; // Initial method stub, actual logic is in overloaded method below
    }

    // RE-WRITING THE WHOLE CLASS to be safe
    public Product addProduct(ProductDto productDto, String imageUrl) {
        Product product = Product.builder()
                .title(productDto.getTitle())
                .description(productDto.getDescription())
                .price(productDto.getPrice())
                .category(productDto.getCategory())
                .stock(productDto.getStock())
                .imageUrl(imageUrl)
                .build();

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductDto productDto, String imageUrl) {
        Product product = getProductById(id);

        product.setTitle(productDto.getTitle());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setCategory(productDto.getCategory());
        product.setStock(productDto.getStock());

        if (imageUrl != null) {
            product.setImageUrl(imageUrl);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
