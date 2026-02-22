package com.app.service;

import com.app.model.*;
import com.app.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;
        private final CartService cartService;
        private final EmailService emailService;

        private static final List<String> STATUS_PIPELINE = List.of(
                        "Placed", "On the Way", "Shipped", "Delivered");
        private static final long SECONDS_PER_STEP = 10;

        @Transactional
        public Order createOrder(User user, String paymentId, String shippingAddress) {
                Cart cart = cartService.getCart(user);
                if (cart.getItems().isEmpty()) {
                        throw new RuntimeException("Cart is empty");
                }

                String paymentStatus = "COD".equals(paymentId) ? "Pending" : "Paid";
                LocalDateTime now = LocalDateTime.now();

                Order order = Order.builder()
                                .user(user)
                                .orderDate(now)
                                .statusUpdatedAt(now)
                                .status("Placed")
                                .paymentId(paymentId)
                                .paymentStatus(paymentStatus)
                                .shippingAddress(shippingAddress)
                                .totalAmount(cart.getTotalPrice())
                                .build();

                List<OrderItem> orderItems = new ArrayList<>();
                for (CartItem cartItem : cart.getItems()) {
                        OrderItem orderItem = OrderItem.builder()
                                        .order(order)
                                        .product(cartItem.getProduct())
                                        .quantity(cartItem.getQuantity())
                                        .price(cartItem.getPrice())
                                        .build();
                        orderItems.add(orderItem);
                }
                order.setOrderItems(orderItems);

                Order savedOrder = orderRepository.save(order);
                cart.getItems().clear();
                cart.setTotalPrice(0.0);

                try {
                        emailService.sendOrderConfirmation(user.getEmail(), savedOrder);
                } catch (Exception e) {
                        System.err.println("Failed to send order confirmation email: " + e.getMessage());
                }

                return savedOrder;
        }

        public List<Order> getUserOrders(User user) {
                return orderRepository.findByUser(user);
        }

        /**
         * Runs every 3 seconds.
         * Advances order status if 10 seconds have passed since the last status change.
         * Uses statusUpdatedAt so it never gets stuck regardless of check timing.
         */
        @Scheduled(fixedRate = 3000)
        @Transactional
        public void updateOrderStatuses() {
                List<Order> orders = orderRepository.findAll();
                LocalDateTime now = LocalDateTime.now();

                for (Order order : orders) {
                        String currentStatus = order.getStatus();
                        if ("Delivered".equals(currentStatus) || "Cancelled".equals(currentStatus)) {
                                continue;
                        }

                        int currentIndex = STATUS_PIPELINE.indexOf(currentStatus);
                        if (currentIndex < 0 || currentIndex >= STATUS_PIPELINE.size() - 1) {
                                continue;
                        }

                        // Use statusUpdatedAt if set, fall back to orderDate for old records
                        LocalDateTime lastChanged = order.getStatusUpdatedAt() != null
                                        ? order.getStatusUpdatedAt()
                                        : order.getOrderDate();

                        long secondsInCurrentStatus = Duration.between(lastChanged, now).getSeconds();

                        if (secondsInCurrentStatus >= SECONDS_PER_STEP) {
                                String nextStatus = STATUS_PIPELINE.get(currentIndex + 1);
                                order.setStatus(nextStatus);
                                order.setStatusUpdatedAt(now);
                                orderRepository.save(order);
                                System.out.println("Order #" + order.getId()
                                                + " advanced: " + currentStatus + " → " + nextStatus);
                        }
                }
        }
}
