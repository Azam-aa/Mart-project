package com.app.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String title;
    private Double price;
    private String category;
}
