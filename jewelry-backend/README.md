# LUXE Jewelry Backend API

This is the FastAPI backend for the LUXE Jewelry E-commerce and AI Design platform.

## 🛠️ Features

- **E-commerce Core**: Products, Categories, Cart, and Order Management.
- **Authentication**: JWT Based Auth (`/api/auth/register`, `/api/auth/login`).
- **AI Design Generation**: Uses Google Gemini Pro to generate jewelry designs based on prompts.
- **Admin Dashboard APIs**: Manage products, orders, categories.
- **MySQL Database**: Uses SQLAlchemy ORM.

## 🚀 Setup Instructions

### 1. Database Setup (XAMPP)

1. Install and start XAMPP.
2. Start the **MySQL** module from the XAMPP Control Panel.
3. Open PHPMyAdmin (<http://localhost/phpmyadmin>) or use a MySQL client.
4. Create a new database named `jewelry_db`:

   ```sql
   CREATE DATABASE jewelry_db;
   ```

### 2. Environment Variables

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and configure:
   - Make sure `DATABASE_URL` matches your local MySQL setup.
   - **Crucial**: Add your actual Google Gemini API key to `GEMINI_API_KEY`.

### 3. Install Dependencies

Run the following commands in the `jewelry-backend` folder:

```bash
# Optional: Create a virtual environment
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows

# Install packages
pip install -r requirements.txt
```

### 4. Run the Database Seeder

To populate the database with mock data (Users, Jewelers, Products, Payment Methods):

```bash
python seeder.py
```

*Note: Ensure the MySQL server is running before executing this.*

### 5. Start the Server

Start the FastAPI application using Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. You can access the interactive Swagger documentation at `http://localhost:8000/docs`.

---

## 💻 Guide for Frontend Developers

### 1. Base URL

All requests should point to `http://localhost:8000/api`.

### 2. Authentication

To access protected routes, first login:

```javascript
const login = async () => {
    // Note: OAuth2 requires data as URLSearchParams (form data), not JSON
    const formData = new URLSearchParams();
    formData.append('username', 'user1'); // Or another seeded user
    formData.append('password', 'password123'); // Default seeded password
    
    const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    });
    
    const data = await response.json();
    return data.access_token; // Store this token (e.g. localStorage)
}
```

### 3. Calling the AI Design Endpoint

This endpoint requires the `Authorization` header.

```javascript
const generateJewelryDesign = async (token) => {
    const payload = {
        type: "Ring",
        color: "Yellow Gold",
        shape: "Princess Cut",
        material: "Gold",
        karat: "18k",
        gemstone_type: "Diamond",
        gemstone_color: "Clear"
    };

    try {
        const response = await fetch('http://localhost:8000/api/ai/generate-design', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include token here!
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        console.log("Image URL:", data.generated_image_url);
        
        // The URL returned is relative (e.g. /static/generated_designs/xyz.jpg)
        // You can display it: 
        // document.getElementById('ai-img').src = "http://localhost:8000" + data.generated_image_url;
        
    } catch (error) {
        console.error("Design failed:", error);
    }
}
```

### 4. Fetching Products

```javascript
const getProducts = async () => {
    const response = await fetch('http://localhost:8000/api/products/');
    const products = await response.json();
    console.log(products);
}
```
