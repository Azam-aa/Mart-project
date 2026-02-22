package com.app.controller;

import com.app.model.Order;
import com.app.model.User;
import com.app.repository.UserRepository;
import com.app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        User user = getUser(userDetails);
        String paymentId = request.get("paymentId");
        String address = request.get("shippingAddress");
        return ResponseEntity.ok(orderService.createOrder(user, paymentId, address));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
