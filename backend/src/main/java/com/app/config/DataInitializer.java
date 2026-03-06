package com.app.config;

import com.app.model.Product;
import com.app.model.Role;
import com.app.model.User;
import com.app.repository.ProductRepository;
import com.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // Seed admin user
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build());
            System.out.println("Admin user created: admin@example.com / admin123");
        }

        // Seed regular user
        if (userRepository.findByEmail("user@example.com").isEmpty()) {
            userRepository.save(User.builder()
                    .username("user")
                    .email("user@example.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .enabled(true)
                    .build());
            System.out.println("Default user created: user@example.com / user123");
        }

        // Seed sample products only if none exist
        if (productRepository.count() == 0) {
            List<Product> products = List.of(
                    // Mobiles
                    Product.builder().title("iPhone 15 Pro")
                            .description("Apple flagship with A17 Pro chip and titanium design.").price(129999.0)
                            .category("Mobiles").stock(50).build(),
                    Product.builder().title("Samsung Galaxy S24 Ultra")
                            .description("AI-powered Galaxy with S Pen and 200MP camera.").price(124999.0)
                            .category("Mobiles").stock(40).build(),
                    Product.builder().title("OnePlus 12").description("Flagship killer with Snapdragon 8 Gen 3.")
                            .price(64999.0).category("Mobiles").stock(60).build(),
                    Product.builder().title("Google Pixel 8 Pro")
                            .description("Best-in-class camera with 7 years of updates.").price(84999.0)
                            .category("Mobiles").stock(30).build(),
                    Product.builder().title("Xiaomi 14 Ultra").description("Professional photography smartphone.")
                            .price(89999.0).category("Mobiles").stock(25).build(),

                    // Laptops
                    Product.builder().title("MacBook Air M3").description("Supercharged by M3 chip, all-day battery.")
                            .price(114999.0).category("Laptops").stock(35).build(),
                    Product.builder().title("Dell XPS 15").description("OLED display, Intel Core i9 powerhouse.")
                            .price(139999.0).category("Laptops").stock(20).build(),
                    Product.builder().title("HP Spectre x360").description("Premium 2-in-1 laptop with OLED touch.")
                            .price(104999.0).category("Laptops").stock(15).build(),
                    Product.builder().title("Lenovo ThinkPad X1 Carbon")
                            .description("Business ultrabook with MIL-SPEC durability.").price(124999.0)
                            .category("Laptops").stock(18).build(),
                    Product.builder().title("ASUS ROG Zephyrus G14")
                            .description("Gaming laptop with RTX 4060, Ryzen 9.").price(94999.0).category("Laptops")
                            .stock(22).build(),

                    // Headphones
                    Product.builder().title("Sony WH-1000XM5")
                            .description("Industry-leading noise cancellation headphones.").price(29999.0)
                            .category("Headphones").stock(45).build(),
                    Product.builder().title("Bose QuietComfort 45").description("Legendary comfort with premium sound.")
                            .price(24999.0).category("Headphones").stock(40).build(),
                    Product.builder().title("Apple AirPods Pro 2")
                            .description("Active noise cancellation with transparency mode.").price(19999.0)
                            .category("Headphones").stock(80).build(),
                    Product.builder().title("Sennheiser Momentum 4")
                            .description("Hi-Fi sound with 60-hour battery life.").price(27999.0).category("Headphones")
                            .stock(30).build(),
                    Product.builder().title("JBL Tune 760NC").description("Wireless on-ear headphones with ANC.")
                            .price(7999.0).category("Headphones").stock(55).build(),

                    // Watches
                    Product.builder().title("Apple Watch Series 9")
                            .description("Advanced health sensors and bright display.").price(41999.0)
                            .category("Watches").stock(60).build(),
                    Product.builder().title("Samsung Galaxy Watch 6")
                            .description("Health & fitness smartwatch with Wear OS.").price(27999.0).category("Watches")
                            .stock(45).build(),
                    Product.builder().title("Garmin Fenix 7").description("Rugged multisport GPS smartwatch.")
                            .price(54999.0).category("Watches").stock(20).build(),
                    Product.builder().title("Fossil Gen 6").description("Wear OS smartwatch with fast charging.")
                            .price(19999.0).category("Watches").stock(35).build(),

                    // Appliances
                    Product.builder().title("Dyson V15 Detect").description("Laser-guided cordless vacuum cleaner.")
                            .price(44999.0).category("Appliances").stock(25).build(),
                    Product.builder().title("LG OLED C3 TV 55\"").description("4K OLED evo TV with AI Picture Pro.")
                            .price(129999.0).category("Appliances").stock(10).build(),
                    Product.builder().title("Samsung Side-by-Side Fridge")
                            .description("Digital Inverter, 700L with water dispenser.").price(69999.0)
                            .category("Appliances").stock(12).build());

            productRepository.saveAll(products);
            System.out.println("Seeded " + products.size() + " sample products.");
        }
    }
}
