package com.app.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductDto {
    private String title;
    private String description;
    private Double price;
    private String category;
    private Integer stock;
    // Image handling will be done via MultipartFile in controller, this DTO might
    // be for JSON parts or just used for reference
}
