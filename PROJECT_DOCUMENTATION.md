# Mart App - Full Technical Documentation

## 1. PROJECT OVERVIEW
**What this project does:** Mart App is a comprehensive, full-stack e-commerce platform that allows users to browse products by categories, add items to a cart, and place orders. It supports order tracking, user profiles, and an administration dashboard for managing inventory. Payment integration includes Cash on Delivery (COD) and Razorpay integration. Note that users are verified via OTP sent to their email during signup, password resets, and alternative login attempts.

**Business purpose:** To provide a robust, scalable, and secure online shopping experience, minimizing fraud through OTP validation and ensuring seamless checkout using Razorpay.

**Main features:**
- User Authentication (JWT + Spring Security + Email OTP).
- Role-based Access Control (USER, ADMIN).
- Admin dashboard for CRUD (Create, Read, Update, Delete) operations on Products with image uploads.
- Shopping Cart functionality (persisted to database for logged-in users, local storage for guests).
- Checkout mechanism supporting Razorpay (Online Payment) and Cash on Delivery.
- Order Lifecycle Management with an automated cron job updating status from `Placed` -> `On the Way` -> `Shipped` -> `Delivered`.
- Automated Email Notifications for OTP and Order Confirmation.

**Target users:** General consumers looking to buy gadgets (Mobiles, Laptops, etc.) and administrators managing the store inventory.

---

## 2. TECH STACK ANALYSIS

### Frontend:
- **Framework:** React.js (Vite compiler).
- **Libraries:** React Router DOM for routing, Axios for HTTP client requests, Framer Motion for animations.
- **State Management:** React Context API (`AuthContext`, `CartContext`, `ThemeContext`).
- **UI Libraries:** Tailwind CSS v4, Tabler Icons (`@tabler/icons-react`), Headless UI elements/CSS overrides.

### Backend:
- **Language:** Java 17.
- **Framework:** Spring Boot 3.4.1.
- **Architecture Pattern:** N-Tier Architecture (Controller, Service, Repository, Model, DTOs).
- **Security:** Spring Security 6.4.2, JWT (io.jsonwebtoken v0.11.5).

### Infrastructure:
- **Databases:** MySQL via Spring Data JPA / Hibernate ORM.
- **Payment:** Razorpay Java SDK.
- **Mail:** JavaMailSender (SMTP via Gmail).
- **File Storage:** Local filesystem (`/uploads`).
- **Cloud Services (Deployment):** Railway (Backend + DB configuration supported via `railway.json`), Vercel (Frontend deployment inferred from CORS).

### Build Tools:
- **Frontend:** npm, Vite.
- **Backend:** Maven (pom.xml).

### Dev Tools:
- **Frontend:** ESLint, PostCSS, Tailwind config.
- **Backend:** Lombok (reducing boilerplate), Spring Boot DevTools.

---

## 3. PROJECT STRUCTURE

```text
/e:/mart-project
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ src/main/java/com/app/
â”‚   â”‚   â”œâ”€â”€ config/         # System bootstrap (DataInitializer) and WebMvc routing config.
â”‚   â”‚   â”œâ”€â”€ controller/     # REST endpoints for Auth, Cart, Products, Orders, Payments.
â”‚   â”‚   â”œâ”€â”€ dto/            # Data Transfer Objects wrapping request/response payloads.
â”‚   â”‚   â”œâ”€â”€ exception/      # Global Exception Handler acting as a RestControllerAdvice.
â”‚   â”‚   â”œâ”€â”€ model/          # JPA database entities (User, Product, Cart, Order, etc.).
â”‚   â”‚   â”œâ”€â”€ repository/     # Spring Data JPA interface integrations wrapping the DB.
â”‚   â”‚   â”œâ”€â”€ security/       # JWT Filters, UserDetails implementation, and Security Config.
â”‚   â”‚   â”œâ”€â”€ service/        # Business logic operations (Business layer).
â”‚   â”‚   â””â”€â”€ BackendApplication.java # Spring Boot main execution class.
â”‚   â”œâ”€â”€ src/main/resources/ 
â”‚   â”‚   â””â”€â”€ application*.properties # Configurations for dev, prod, and defaults.
â”‚   â””â”€â”€ pom.xml             # Backend dependencies and build plugins configurations.
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ public/             # Static public assets.
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ assets/         # Static images / design assets.
â”‚   â”‚   â”œâ”€â”€ components/     # Reusable UI components (Buttons, Inputs, Cards, Layouts).
â”‚   â”‚   â”œâ”€â”€ context/        # React context providers representing global state.
â”‚   â”‚   â”œâ”€â”€ lib/            # Constant definitions and functional utilities.
â”‚   â”‚   â”œâ”€â”€ pages/          # Web page views mapped to routers.
â”‚   â”‚   â”œâ”€â”€ App.jsx         # App router wrapper providing Context layers.
â”‚   â”‚   â”œâ”€â”€ index.css       # Tailwind CSS base and theme injections.
â”‚   â”‚   â””â”€â”€ main.jsx        # Frontend Entry React DOM logic.
â”‚   â”œâ”€â”€ package.json        # Frontend dependency list and NPM scripts.
â”‚   â””â”€â”€ vite.config.js      # Vite build configurations.
â””â”€â”€ README.md / USER_GUIDE.md # Root documents for user manual testing and system overview.
```

---

## 4. HIGH LEVEL DESIGN (HLD)

### System Overview & Architecture:
Mart App employs a decoupled Service-Oriented (Client-Server) architecture.
- **Frontend** strictly functions as a rich client via a browser using React (SPA pattern).
- **Backend** acts as an isolated RESTful API built on Spring Boot.

### Client â†’ Server Flow:
1. **User interaction** occurs in React Pages.
2. Context Providers (like `CartContext` or `AuthContext`) translate operations into Axios/Fetch asynchronous calls.
3. Network traffic routed to `http://localhost:8080/api/*` intercepts requests.
4. If requests require authorization, the client sends a `Bearer <JWT_TOKEN>`. The `JwtFilter` parses and verifies it.
5. Requests hit Controllers, pass to Services for business logic (e.g., deducting stock or creating orders), commit to MySQL DB sequentially, and finally return a JSON payload format response back to the client. View re-renders.

### Deployment Architecture:
- The app uses `railway.json` indicating a deployment on Railway for the Backend and MySQL Database.
- The Frontend connects automatically via Vite proxies or `.env` variables mapped onto platforms like Vercel. 

---

## 5. LOW LEVEL DESIGN (LLD)

### BE Module: Config
- **DataInitializer**: Implements `CommandLineRunner`. Seeds initial Database upon execution empty-start. Creates `admin` and `user` fallback accounts and seeds roughly 20 products for catalog testing.
- **WebConfig**: Assigns Resource Handlers specifically to map `/uploads/**` URLs to the physical `uploads/` dir for image rendering.

### BE Module: Controllers
- **AuthController**: `/api/auth`. Defines logic for handling Signups, standard logins, admin logins, sending OTPs, verifying OTPs, and password reset functionalities.
- **CartController**: `/api/cart`. Maps logic for fetching current authenticated user cart, adding an item, and removing an item.
- **OrderController**: `/api/orders`. Fetches users' past orders and maps the payment confirmation flow to create an order instance.
- **PaymentController**: `/api/payment`. Maps RazorPay server-created JSON object flows using RazorPay API.
- **ProductController**: `/api/products`. Handles pagination fetching of inventory, along with Admin secured mutating paths (`POST`, `PUT`, `DELETE` with Multipart images).

### BE Module: Services
- **AuthService**: Handles Auth business logic. Passwords are Encrypted on save. Triggers Email Service to send OTP generation parameters for verification.
- **CartService**: Finds or creates the Cart Object on the fly per user. Resolves total pricing algorithms safely before DB save.
- **EmailService**: Leverages `JavaMailSender` MimeMessageHelper to send styled HTML emails for Order Confirmations and standard text for OTP logins.
- **FileStorageService**: Utility handler wrapping generic `java.nio.file.Files.copy` for `MultipartFile` inputs, securely saving to static drive space assigning randomized UUID prefixes to prevent overwrites.
- **OrderService**: Maps Cart items to OrderItems. Clears the cart. Dispatches email. Uses the `@Scheduled(fixedRate = 3000)` Cron operation to automatically iterate Un-shipped orders to `Delivered` incrementally every 10 seconds asynchronously.
- **PaymentService**: Invokes RazorPay API client to allocate a `txn_...` payload receipt to safely transfer payment tokens securely.
- **ProductService**: Encompasses JPA pagination interfaces returning `Page<Product>` arrays correctly to the controller.

### BE Module: Models & Repositories
- **Entities**: User, Role, Product, Cart, CartItem, Order, OrderItem. Uses `jakarta.persistence.*`.
- **Relationships**: 
  - User 1:1 Cart, Cart 1:M CartItem.
  - User 1:M Order, Order 1:M OrderItem.
  - OrderItem M:1 Product, CartItem M:1 Product.
- **Repositories**: Standard `JpaRepository<T, ID>` extensions. 

### BE Module: Details & Configs
- **Security**: Utilizing Spring Security 6 configurations via `SecurityFilterChain`. The `JwtFilter` runs extending `OncePerRequestFilter`. `CustomUserDetailsService` abstracts the core context bindings mapping Email to User details securely.

---

## 6. API DOCUMENTATION

| Endpoint | Method | Body Payload (Req) | Role/Auth | Service Class Interaction | Description |
|---|---|---|---|---|---|
| `/api/auth/login` | POST | `LoginRequest(email, password)` | Public | AuthService | Authenticates natively. Might bypass OTP for seed Users, otherwise triggers Email OTP. |
| `/api/auth/signup` | POST | `SignupRequest(username, email, pass)`| Public | AuthService | Registers user but keeps account `enabled=false` until OTP completion. |
| `/api/auth/verify-otp`| POST | `VerifyOtpRequest(email, otp)` | Public | AuthService | Verifies OTP sent via email and returns JWT. Enables Account. |
| `/api/auth/reset-password`| POST | `{email, otp, newPassword}` | Public | AuthService | Accepts OTP parameter to alter password. |
| `/api/products` | GET | URL Params: `category`, `page`, `size` | Public | ProductService| Fetches Paginated Product Feed JSON. |
| `/api/products` | POST | form-data: `title`, `price`... `image` | ADMIN | ProductService| Creates new catalog stock unit securely. |
| `/api/products/{id}`| PUT | form-data: `title`, `price`... `image` | ADMIN | ProductService| Amends Product details and potentially Image mapping. |
| `/api/cart` | GET | Empty | USER | CartService | Fetches User's aggregate cart & nested relations. |
| `/api/cart/add` | POST | `{ productId, quantity }` | USER | CartService | Inserts or increments quantitative cart values. |
| `/api/payment/create-order`| POST| `{ amount, currency }` | USER | PaymentService| Calls RazorPay downstream, generates initial Order ID. |
| `/api/orders/create`| POST | `{ paymentId, shippingAddress }` | USER | OrderService | Commits Cart elements to historical Orders tracking tables. |

---

## 7. DATABASE DESIGN

### Schema Visualizations

- **users** (`id` PK, `username` UQ, `email` UQ, `password`, `role`, `otp`, `otpExpiry`, `enabled`)
- **products** (`id` PK, `title`, `description` (1000 length), `price`, `category`, `imageUrl`, `stock`)
- **cart** (`id` PK, `user_id` FK(users), `totalPrice`)
- **cart_items** (`id` PK, `cart_id` FK(cart), `product_id` FK(products), `quantity`, `price`)
- **orders** (`id` PK, `user_id` FK(users), `totalAmount`, `orderDate`, `statusUpdatedAt`, `status`, `paymentId`, `paymentStatus`, `shippingAddress`)
- **order_items** (`id` PK, `order_id` FK(orders), `product_id` FK(products), `quantity`, `price`)

---

## 8. CONFIGURATION ANALYSIS

- **`application.properties`**: Controls main behavior (profile selection via `spring.profiles.active=dev`).
- **`application-dev.properties`**: The local configuration.
  - Connects to local `mysql://localhost:3306/martdb` using root/1234 credentials.
  - Uses hardcoded `jwt.secret` (mysupersecure...).
  - Uses hardcoded Email SMTP Gmail connection `azamp442@gmail.com` with App Password.
  - Sets multipart upload limits to 10MB.
  - Assigns RazorPay Test Client Keys.
  - Defines Vite Web URL `http://localhost:5173` for Spring CORS origins arrays.
- **`application-prod.properties`**: Designed for Railway/Cloud deployments.
  - Completely swaps hardcoded local data for Environment Variable injectors (e.g., `${DATABASE_URL}`, `${JWT_SECRET}`, `${MAIL_PASSWORD}`).

---

## 9. SECURITY

**Mechanisms:**
- Authentication is governed by `JwtFilter` extending `OncePerRequestFilter`. The endpoint structure assigns Stateless session management policies.
- **Authorization:** Granular paths restricting `/api/admin/**` mapped to Spring Authorities `ROLE_ADMIN` and modifying products mapped internally or at filter chains.
- **Cryptography:** Passwords secured via standard Spring Security `BCryptPasswordEncoder`. 
- **MFA:** OTP codes are sent dynamically overriding generic logins to enable Two Factor Security flows if users aren't whitelisted. Generates 6-digit payloads randomly formatted (`%06d`).

**Default Identified Credentials:**
- `admin@example.com` / `admin123`
- `user@example.com` / `user123` 

---

## 10. DEPENDENCY ANALYSIS

**Backend (`pom.xml`):**
- **spring-boot-starter-data-jpa**: Hibernate ORM implementation.
- **spring-boot-starter-security**: Framework for the core JWT filter binding.
- **spring-boot-starter-web**: Tomcat execution environment and basic JSON API mappings.
- **spring-boot-starter-mail**: SMTP dispatch tool.
- **mysql-connector-j**: MySQL driver dialect.
- **jjwt-api / impl / jackson**: Core artifacts for issuing and deciphering JWT keys.
- **razorpay-java**: Gateway integration. 

**Frontend (`package.json`):**
- **react / react-dom**: UI foundational view library.
- **react-router-dom**: Complex conditional and nested route logic tracking.
- **tailwindcss / @tailwindcss/vite**: Base UI presentation styles config pipeline.
- **axios**: Robust web network interceptor mappings (essential for globally attaching `Authorization: Bearer <TOKEN>`).
- **@tabler/icons-react**: High fidelity unified component styling SVGs.
- **framer-motion**: Utilized for micro-interaction states.

---

## 11. BUILD AND RUN INSTRUCTIONS

### Database Prerequisites:
Ensure MySQL is running on port 3306 natively or via Docker. The Schema automatically scaffolds via `spring.jpa.hibernate.ddl-auto=update`. Create Database `martdb`.

### Backend (Spring Boot 3):
1. Navigate to the `/backend` folder.
2. Ensure you have Java 17+ installed.
3. Run using Maven wrapper:
   ```bash
   ./mvnw clean spring-boot:run
   ```
   *The server mounts to `localhost:8080`.*

### Frontend (Vite/React):
1. Navigate to the `/frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The UI loads on `http://localhost:5173`.*

---

## 12. DEPLOYMENT ARCHITECTURE
- **Dev mode**: Localhost. Uses basic configurations tracking local DB states natively inside `.env.development`.
- **Production mode**: 
  - Tracks settings dynamically. The presence of `nixpacks.toml` and `Procfile`/`railway.json` mandates that Railway pulls the Github code, builds Via Java Maven build pipelines utilizing the custom Nix environments.
  - Generates Java `.jar` executing on dynamic server domains linking internal MySQL plugins dynamically through `.env` arrays.
  - Vercel `vercel.json` intercepts fallback React client routing (`"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`) pushing React bundle statically. 

---

## 13. CODE QUALITY ANALYSIS

**Design Patterns utilized:**
- **Dependency Injection**: Heavy `@Autowired` / `@RequiredArgsConstructor` mapping via Lombok in Spring contexts.
- **DTO Pattern**: Clear demarcations of request/responses objects (`AuthResponse`, `SignupRequest`) abstracting DB constraints directly.
- **Builder Pattern**: Enabled natively on Models via `@Builder` in Lombok creating robust declarative instantiation pipelines.

**Potential improvements:**
1. Hardcoded generic OTP validation currently binds directly to standard `User` Table instead of a decoupled cache/redis store. Temporary tables dropping post-validation mitigates data bloat.
2. Cart item values currently don't sync comprehensively to LocalStorage fallback hooks automatically forcing DB dependencies immediately.
3. Admin endpoints natively check URLs for roles, but missing robust Method Level Security (`@PreAuthorize("hasRole('ADMIN')")`).

---

## 14. COMPLETE FLOW OF APPLICATION

1. **User Action**: The User navigates to `[URL]/signup` inserting detail inputs.
2. **Frontend processing**: React fires `axios.post()` intercepting constraints and formatting payload string.
3. **Backend processing (Auth)**: Controller takes over. Instantiates `User`, tags it generic `enabled=false`, generates randomized 6-digit OTP, commits payload constraints strictly, invokes JavaMailSender dispatch via `smtp.gmail.com` using App Authentication payload string.
4. **User Intersects OTP**: Retrieves code from email. Submits forms.
5. **Session Initiation**: Backend correlates DB string payload matching `< 5 MIN` criteria. Deletes payload. Returns HTTP headers including JSON object with `Bearer` payload JWT signed token.
6. **Frontend Store**: Parses JWT. `AuthContext.jsx` initiates state. Binds internal `localstorage.setItem`.
7. **Purchasing & Sync**: Cart state triggers initial DB load syncing `items` arrays natively avoiding UI/DB disparities. User commits checkout triggers RazorPay dialog mappings internally, sending Payment Token to BE mapped natively generating `Order` Object recursively duplicating relations statically to `OrderItem`.
8. **Automated Finalization**: A Background JVM Thread `OrderService.updateOrderStatuses()` runs every 3000ms updating UI asynchronously mapping fulfillment steps.

---

## 15. IMPORTANT FILES EXPLAINED

- **`App.jsx`**: Dictates the frontend Router wrapping. Uses a custom implementation `<ProtectedRoute/>` filtering rendering dependent on active context authorization statuses.
- **`SecurityConfig.java`**: Critical system gateway binding Web mappings blocking native cross-origin (CORS) access dynamically based on execution deployment URL strings mapping URLs like `/api/products` for public GET calls while keeping POST secured.
- **`DataInitializer.java`**: Important entry point saving developers manual DB migrations or bootstrapping dependencies executing raw seeded products and administrative roles upon fresh Database wipe-and-loads.
- **`AuthContext.jsx`**: Encases the application network mappings using `axios.interceptors` dynamically catching 401s globally preventing API request timeouts mapping users uniformly back to `/login`.

---

## 16. SECURITY RISKS OR ISSUES

1. **Exposed Application Properties Secrets**: The local `application-dev.properties` natively contains Gmail App Passwords and RazorPay test tokens committed inside source control locally. Dev environments should preferably strip to `.env` models natively regardless to prevent accidental public leakage.
2. **Multipart Size Constraints**: Allows up to `10MB` limit constraints which natively can cause local SSD flooding on rapid automated scripts mapping `/api/products` endpoints. Need File-Typing (`MIME`) constraints mapped in the controllers ensuring execution payload blocks for maliciously named extensions `.exe`/`.sh` wrapped as images.
3. **Hardcoded Fallbacks**: Seed data bypasses OTP if it detects users containing specific email mappings (`user@example.com`).

---

## 17. SUMMARY FOR DEVELOPERS
**Getting Up To Speed:**
The application utilizes a purely isolated Full-Stack paradigm heavily reliant on Spring Context Beans and React Context hooks mapping asynchronous tokens reliably. 
- Ensure you have correctly run the DB instances mapping URL parameters matching local properties.
- When generating UI components, map to `TailwindCSS` inline elements, binding state to `Axios` calls wrapping `Context`. 
- Adding features natively maps modifying backend Domain `Model` fields, migrating the DTO representation uniformly, rendering to frontend interfaces accurately matching variables securely checking endpoints inside Postman initially using local Bearer payloads parsed via standard Logins.
