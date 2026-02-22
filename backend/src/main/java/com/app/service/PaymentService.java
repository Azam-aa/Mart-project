package com.app.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private RazorpayClient client;

    @PostConstruct
    public void init() throws RazorpayException {
        if (keyId == null || keyId.isEmpty())
            keyId = "rzp_test_placeholder";
        if (keySecret == null || keySecret.isEmpty())
            keySecret = "secret_placeholder";
        this.client = new RazorpayClient(keyId, keySecret);
    }

    public String createOrder(Double amount, String currency) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (amount * 100));
        orderRequest.put("currency", currency != null ? currency : "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = client.orders.create(orderRequest);
        return order.toString();
    }
}
