package com.app.controller;

import com.app.model.Cart;
import com.app.model.User;
import com.app.service.CartService;
import com.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("GET /api/cart - User: " + (userDetails != null ? userDetails.getUsername() : "null"));
        User user = getUser(userDetails);
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> request) {
        System.out.println("POST /api/cart/add - User: " + (userDetails != null ? userDetails.getUsername() : "null")
                + " Payload: " + request);
        User user = getUser(userDetails);
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        return ResponseEntity.ok(cartService.addToCart(user, productId, quantity));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(cartService.removeFromCart(user, productId));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
