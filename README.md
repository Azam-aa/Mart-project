# Mart App - Full Stack E-commerce Application

## 🚀 Overview
Mart App is a comprehensive e-commerce platform built with a modern Full Stack architecture. It features secure user authentication, product management for admins, and a seamless shopping experience for users with cart functionality and Razorpay payment integration.

## 🛠 Tech Stack
### Frontend
-   **Framework**: React.js (Vite)
-   **Styling**: Tailwind CSS v4
-   **State Management**: Context API (Auth, Cart, Theme)
-   **HTTP Client**: Axios
-   **Icons**: Tabler Icons

### Backend
-   **Framework**: Spring Boot 3
-   **Security**: Spring Security (JWT + BCrypt)
-   **Database**: MySQL
-   **ORM**: Hibernate / Spring Data JPA
-   **Payment Gateway**: Razorpay
-   **Email Service**: JavaMailSender (SMTP)

## 📂 Folder Structure
```
mart-project/
├── backend/                # Spring Boot Backend
│   ├── src/main/java/com/app/
│   │   ├── config/         # Security, CORS, Web Config
│   │   ├── controller/     # REST Controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── model/          # JPA Entities
│   │   ├── repository/     # JPA Repositories
│   │   ├── service/        # Business Logic
│   │   └── BackendApplication.java
│   └── src/main/resources/ # Properties & Templates
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── context/        # React Contexts
│   │   ├── pages/          # Application Pages
│   │   └── main.jsx        # Entry Point
│   ├── public/
│   └── package.json
└── USER_GUIDE.md           # Instructions for Verification
```

## 🚦 Getting Started
1.  **Backend**:
    ```bash
    cd backend
    mvn clean spring-boot:run
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
3.  **Access**:
    -   Frontend: `http://localhost:5173`
    -   Backend API: `http://localhost:8080`

## 🔑 Default Credentials
See `USER_GUIDE.md` for detailed login information.
