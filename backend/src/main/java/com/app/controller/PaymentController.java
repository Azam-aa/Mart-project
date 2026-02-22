package com.app.controller;

import com.app.service.PaymentService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            Double amount = Double.parseDouble(data.get("amount").toString());
            String currency = (String) data.get("currency");
            String orderData = paymentService.createOrder(amount, currency);
            return ResponseEntity.ok(orderData);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Error creating Razorpay order: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
