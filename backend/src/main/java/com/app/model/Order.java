package com.app.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderItem> orderItems = new ArrayList<>();

    private Double totalAmount;
    private LocalDateTime orderDate;
    private LocalDateTime statusUpdatedAt; // Tracks when status was last changed
    private String status; // Placed, On the Way, Shipped, Delivered
    private String paymentId; // Razorpay Payment ID or COD
    private String paymentStatus; // Paid, Pending
    private String shippingAddress;
}
