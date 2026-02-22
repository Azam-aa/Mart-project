package com.app.service;

import com.app.model.Cart;
import com.app.model.CartItem;
import com.app.model.Product;
import com.app.model.User;
import com.app.repository.CartRepository;
import com.app.repository.ProductRepository;
import com.app.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Cart getCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> createCart(user));
    }

    private Cart createCart(User user) {
        Cart cart = Cart.builder()
                .user(user)
                .totalPrice(0.0)
                .build();
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart addToCart(User user, Long productId, Integer quantity) {
        Cart cart = getCart(user);

        // Ensure items list is not null (redundant with @Builder.Default but safe)
        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity((item.getQuantity() != null ? item.getQuantity() : 0) + quantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .price(product.getPrice() != null ? product.getPrice() : 0.0)
                    .build();
            cart.getItems().add(newItem);
        }

        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(User user, Long productId) {
        Cart cart = getCart(user);
        if (cart.getItems() != null) {
            cart.getItems().removeIf(item -> item.getProduct() != null && item.getProduct().getId().equals(productId));
        }
        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    private void updateCartTotal(Cart cart) {
        if (cart.getItems() == null) {
            cart.setTotalPrice(0.0);
            return;
        }
        double total = cart.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getPrice() != null)
                .mapToDouble(
                        item -> item.getProduct().getPrice() * (item.getQuantity() != null ? item.getQuantity() : 0))
                .sum();
        cart.setTotalPrice(total);
    }
}
