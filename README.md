# CampusHub JKUAT

CampusHub JKUAT is a marketplace and booking platform designed for JKUAT students.

## Core users

1. Students - browse, order, book services, rate
2. Vendors - list products/services, manage orders, manage availability
3. Landlords/Agents - list hostels/houses for rent
4. Admin - moderate, verify vendors

## Core modules

1. Auth: Student email/phone signup, vendor onboarding, role-based access
2. Marketplace: Products - clothes, food, utensils, furniture, supermarket items
3. Services: Laundry, salon, medical/treatment booking with time slots
4. House hunting: Hostel/house listings with filters for price, location, amenities, booking for viewing
5. Cart + Checkout: M-Pesa STK push integration, cash on delivery option
6. Orders + Bookings dashboard for users and vendors
7. Reviews + Ratings
8. Search + Filters + Categories
9. Admin panel for approvals

## Tech stack

- Frontend: React + TailwindCSS + Vite
- Backend: Node.js + Express + MongoDB
- Auth: JWT
- Payments: Daraja API for M-Pesa STK push
- File uploads: Cloudinary for product/house images
- Hosting: Frontend on Vercel, Backend on Render

## Local setup

1. Backend
   - Open `backend` and install dependencies:
     ```powershell
     cd "c:\Users\USER\OneDrive\Desktop\JkuatApp\backend"
     npm install
     ```
   - Copy `.env.example` to `.env` and fill in your MongoDB and Daraja credentials.
   - Start the backend:
     ```powershell
     npm start
     ```

2. Frontend
   - From the repository root:
     ```powershell
     cd "c:\Users\USER\OneDrive\Desktop\JkuatApp"
     npm install
     npm run dev
     ```
   - Open the Vite URL shown in the terminal.

## Design

- Mobile-first, fast loading, simple UI for campus users
- Use Kenyan shilling (KES)
- All dates/times in Africa/Nairobi timezone
