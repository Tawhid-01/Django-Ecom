# 🛍️ Django E-Commerce Platform

A fully functional, feature-rich e-commerce web application built with **Django**. This platform provides a complete online shopping experience—from product discovery and cart management to secure checkout and role-based order tracking.

---

## 🌟 Features

- **Product Catalog & Filtering:** Browse products by categories, search items, and apply dynamic filters.
- **Shopping Cart & Wishlist:** Add, update, or remove items in real-time and save products for later.
- **Secure Checkout & Address Management:** Select shipping addresses and place orders seamlessly.
- **User Authentication & Roles:** Secure customer signup, login, and profile management with role-based access control (customers vs. admins).
- **Order Management:** Track order statuses from placement to delivery.
- **Admin Dashboard:** Comprehensive backend management for inventory, categories, products, and customer orders via the Django Admin panel.

---

## 🛠️ Tech Stack

- **Backend:** Python, Django
- **Frontend:** HTML5, CSS3, JavaScript, Tailwind CSS / Bootstrap
- **Database:** SQLite (Development) / PostgreSQL (Production ready)
- **Deployment:** PythonAnywhere / Render / Vercel

---

## 📁 Project Structure

```text
Django-Ecom/
│
├── core/                   # Main project configuration and settings
├── products/               # App handling product catalog, categories, and inventory
├── cart/                   # App managing cart sessions and items
├── orders/                 # App handling checkout, address selection, and order processing
├── accounts/               # App for user authentication and profiles
├── templates/              # HTML frontend templates
├── static/                 # CSS, JavaScript, and image assets
├── db.sqlite3              # Local SQLite database
├── manage.py               # Django command-line utility
└── requirements.txt        # Project dependencies
