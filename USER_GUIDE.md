# User & Admin Verification Guide

Use this guide to test all features of the Mart App.

## Default Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` |
| **User** | `user@example.com` | `user123` |

---

## 1. Admin Verification Steps
**Goal**: Verify Product Management and Dashboard.

1.  **Login**:
    *   Navigate to `/login`.
    *   Enter Admin credentials.
    *   **Expect**: Redirect to Dashboard.
2.  **Access Admin Panel**:
    *   Click "Admin Panel" in the Navbar.
    *   **Expect**: Navigate to `/admin` (Admin Dashboard).
3.  **Add Product**:
    *   Fill in Title, Description, Price, Category, Stock.
    *   Upload an image.
    *   Click "Add Product".
    *   **Expect**: Alert "Product added successfully!" and product appears in the list below.
4.  **Edit Product**:
    *   Click "Edit" on any product.
    *   Change the price or stock.
    *   Click "Update Product".
    *   **Expect**: Alert "Product updated successfully!" and list reflects changes.
5.  **Delete Product**:
    *   Click "Delete" on a product.
    *   **Expect**: Product is removed from the list.

## 2. User Verification Steps
**Goal**: Verify Browsing, Cart, and Checkout.

1.  **Login**:
    *   Navigate to `/login`.
    *   Enter User credentials.
    *   **Expect**: Redirect to Dashboard.
2.  **Browse Products**:
    *   Scroll through the product grid.
    *   Filter by Category (if available).
3.  **Verify Pagination**:
    *   Ensure only 12 products are displayed per page.
    *   Scroll down to find pagination controls (Previous, 1, 2, 3..., Next).
    *   Click "Next" or a page number to load more products.
4.  **Add to Cart**:
    *   Click "Add to Cart" on a product.
    *   **Expect**: Cart count in Navbar increases.
5.  **Manage Cart**:
    *   Click "Cart" in Navbar.
    *   Increase/Decrease quantity of an item.
    *   Remove an item.
    *   **Expect**: Total price updates accordingly.
5.  **Checkout**:
    *   **Input**: Enter a "Shipping Address" in the text area.
    *   Click "Checkout with Razorpay".
    *   **Payment**: Select "Netbanking" or "Card" (Test Mode) -> click "Success".
    *   **Expect**:
        *   Success Alert: "Payment Successful! Order Confirmed."
        *   Cart clears.
        *   **Email**: Check your inbox (or backend logs) for an Order Confirmation email.

## 3. General Checks
*   **Logout**: Click "Logout" in Navbar -> Expect redirect to Login.
*   **Theme**: Toggle Dark/Light mode in Navbar -> Expect UI colors to change.
*   **Responsive**: Resize browser window -> Expect Navbar and Grid to adjust layout.
