package com.app.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your Login OTP - Mart App");
            helper.setText("<h3>Your OTP for Login is within Mart App:</h3><h1>" + otp
                    + "</h1><p>This OTP is valid for 5 minutes.</p>", true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email");
        }
    }

    public void sendOrderConfirmation(String toEmail, com.app.model.Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Order Confirmation - Order #" + order.getId());

            StringBuilder html = new StringBuilder();
            html.append("<h2>Thank you for your order!</h2>");
            html.append("<p>Hi " + order.getUser().getUsername() + ",</p>");
            html.append("<p>We have received your order. Here are the details:</p>");
            html.append("<h3>Order Summary (ID: " + order.getId() + ")</h3>");
            html.append("<p><strong>Access Date:</strong> " + order.getOrderDate() + "</p>");
            html.append("<p><strong>Shipping Address:</strong> " + order.getShippingAddress() + "</p>");
            html.append("<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>");
            html.append("<tr><th>Product</th><th>Qty</th><th>Price</th></tr>");

            for (com.app.model.OrderItem item : order.getOrderItems()) {
                html.append("<tr>");
                html.append("<td>" + item.getProduct().getTitle() + "</td>");
                html.append("<td>" + item.getQuantity() + "</td>");
                html.append("<td>₹" + item.getPrice() + "</td>");
                html.append("</tr>");
            }

            html.append("</table>");
            html.append("<h3>Total Amount: ₹" + order.getTotalAmount() + "</h3>");
            html.append("<p>We will notify you when your order is shipped!</p>");

            helper.setText(html.toString(), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            // Don't throw exception to avoid rolling back order transaction just for email
            // failure
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
    }
}
