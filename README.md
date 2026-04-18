# Vivelt Gold Jewelry Platform

A full-stack e-commerce platform for luxury jewelry featuring an AI-powered custom design generator.

## Prerequisites

- Python 3.13+
- Node.js 24+
- MySQL Server

## Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd jewelry-backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Set up your MySQL `DATABASE_URL`
   - Generate a new `SECRET_KEY` (e.g., using `python -c "import secrets; print(secrets.token_hex(32))"`)
   - Add your `GEMINI_API_KEY`
5. Run migrations/seeder (if applicable) or start the server:
   ```bash
   python seeder.py
   uvicorn main:app --reload
   ```

## Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd jewelry-store
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies

- **Backend**: FastAPI, SQLAlchemy, MySQL, PyJWT, Google Generative AI
- **Frontend**: Next.js 14, React, Tailwind CSS, TypeScript