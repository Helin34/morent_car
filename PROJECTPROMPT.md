# Role & Project Overview

You are an expert Full-Stack Software Architect and Senior Next.js Developer.
Your goal is to build a modern Car Rental Web Application ("Morent") using Next.js (App Router, TypeScript) for both frontend and backend, with MongoDB as the database.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 15+ (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (via Mongoose or official MongoDB native driver)
- **Authentication**: NextAuth.js (Auth.js)
- **State & Data Fetching**: React Server Components (RSC) + Server Actions / Route Handlers

---

## 🚫 Critical Constraints & Negative Prompts (DO NOT VIOLATE)

1. **NO Stripe Backend Implementation**: Stripe payments are planned for later. DO NOT implement Stripe backend APIs, webhooks, or checkout sessions. You may only stub the payment status field (e.g., `paymentStatus: 'pending' | 'completed'`) in data models.
2. **NO Vehicle Image Storage in Database**: Do NOT store base64 image data, binary blobs, or cloud storage URLs in MongoDB. Car image assets must be mapped and handled entirely on the frontend (e.g., matching a vehicle `slug` or `id` to local public assets).
3. **Strict Design Adherence**: You must strictly follow the UI layouts, design tokens, and components provided in the `design/` directory. Each subfolder contains `code.html` (HTML + Tailwind CSS) and `screen.png` (reference screenshot):
   - `design/morent_home_page/`
   - `design/morent_vehicles_catalog_page/`
   - `design/morent_car_detail_page/`
   - `design/morent_login_page/`
   - `design/morent_register_page/`
4. **Step-by-Step Phased Execution**: DO NOT generate the entire application codebase in a single response. Execute one phase at a time and ask for confirmation before moving to the next.

---

## 📋 Core Technical Requirements

### 1. Database & Vehicle Schema

Define a clean MongoDB schema for rental vehicles containing all details a customer needs to make a booking:

- `name`, `brand`, `type` (e.g., SUV, Sedan, Sport, Coupe)
- `gasolineCapacity` (liters), `steering` (Manual / Automatic)
- `seatCapacity` (number of persons)
- `pricePerDay` (number), `discountPricePerDay` (optional number)
- `description` (markdown/text)
- `features` (array of strings, e.g., ["Air Conditioning", "GPS Navigation", "Bluetooth"])
- `availability` (boolean or date range availability)
- `slug` / `assetId` (identifier for frontend image lookup)

### 2. Vehicle Catalog API Requirements

Build backend route handlers or server actions supporting:

- **Filtering**: By category/type, capacity, max price per day.
- **Sorting**: Price (low-to-high, high-to-low), popularity, newest.
- **Pagination**: `page` and `limit` support with total count and metadata.

### 3. Authentication System (NextAuth.js)

- Credentials provider (Email & Password registration/login with bcrypt hashing).
- OAuth provider (Google Sign-In).
- Session management (JWT strategy) with signout support.
- User schema in MongoDB: `name`, `email`, `passwordHash` (optional for OAuth), `image`, `role`, timestamps.

---

## 🏗️ Phased Implementation Plan

Please follow this phased sequence. Complete **Phase 1** first, verify it, and pause for approval before continuing:

- **Phase 1: Backend Foundation & Database Layer**
  - MongoDB connection utility with connection pooling/caching.
  - User and Car Mongoose schemas/models.
  - NextAuth.js configuration (Google + Credentials) and auth route handlers.
  - Car catalog REST API / Server Action with filtering, sorting, and pagination logic.
  - Seed script with mock rental car data to populate MongoDB.

- **Phase 2: Authentication UI & State**
  - Integrate designs from `design/morent_login_page/` and `design/morent_register_page/`.
  - Connect forms with NextAuth actions, loading states, and error toasts.

- **Phase 3: Catalog & Discovery UI**
  - Implement Home page from `design/morent_home_page/`.
  - Implement Vehicles Catalog page with interactive sidebar filters, sort dropdown, and pagination from `design/morent_vehicles_catalog_page/`.
  - Implement dynamic frontend image resolver linking car identifiers to local asset placeholders.

- **Phase 4: Car Detail & Reservation Flow**
  - Implement Car Detail page from `design/morent_car_detail_page/`.
  - Build booking date-selection and summary interface (with dummy payment placeholder).

---

## 🏁 Starting Step

Start by generating **Phase 1**: Set up the MongoDB connection helper, the `User` and `Car` models, the NextAuth configuration, and the car listing API with filtering/pagination.

# Role & Project Overview

You are an expert Full-Stack Software Architect and Senior Next.js Developer.
Your goal is to build a modern Car Rental Web Application ("Morent") using Next.js (App Router, TypeScript) for both frontend and backend, with MongoDB as the database.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 15+ (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (via Mongoose or official MongoDB native driver)
- **Authentication**: NextAuth.js (Auth.js)
- **State & Data Fetching**: React Server Components (RSC) + Server Actions / Route Handlers

---

## 🚫 Critical Constraints & Negative Prompts (DO NOT VIOLATE)

1. **NO Stripe Backend Implementation**: Stripe payments are planned for later. DO NOT implement Stripe backend APIs, webhooks, or checkout sessions. You may only stub the payment status field (e.g., `paymentStatus: 'pending' | 'completed'`) in data models.
2. **NO Vehicle Image Storage in Database**: Do NOT store base64 image data, binary blobs, or cloud storage URLs in MongoDB. Car image assets must be mapped and handled entirely on the frontend (e.g., matching a vehicle `slug` or `id` to local public assets).
3. **Strict Design Adherence**: You must strictly follow the UI layouts, design tokens, and components provided in the `design/` directory. Each subfolder contains `code.html` (HTML + Tailwind CSS) and `screen.png` (reference screenshot):
   - `design/morent_home_page/`
   - `design/morent_vehicles_catalog_page/`
   - `design/morent_car_detail_page/`
   - `design/morent_login_page/`
   - `design/morent_register_page/`
4. **Step-by-Step Phased Execution**: DO NOT generate the entire application codebase in a single response. Execute one phase at a time and ask for confirmation before moving to the next.

---

## 📋 Core Technical Requirements

### 1. Database & Vehicle Schema

Define a clean MongoDB schema for rental vehicles containing all details a customer needs to make a booking:

- `name`, `brand`, `type` (e.g., SUV, Sedan, Sport, Coupe)
- `gasolineCapacity` (liters), `steering` (Manual / Automatic)
- `seatCapacity` (number of persons)
- `pricePerDay` (number), `discountPricePerDay` (optional number)
- `description` (markdown/text)
- `features` (array of strings, e.g., ["Air Conditioning", "GPS Navigation", "Bluetooth"])
- `availability` (boolean or date range availability)
- `slug` / `assetId` (identifier for frontend image lookup)

### 2. Vehicle Catalog API Requirements

Build backend route handlers or server actions supporting:

- **Filtering**: By category/type, capacity, max price per day.
- **Sorting**: Price (low-to-high, high-to-low), popularity, newest.
- **Pagination**: `page` and `limit` support with total count and metadata.

### 3. Authentication System (NextAuth.js)

- Credentials provider (Email & Password registration/login with bcrypt hashing).
- OAuth provider (Google Sign-In).
- Session management (JWT strategy) with signout support.
- User schema in MongoDB: `name`, `email`, `passwordHash` (optional for OAuth), `image`, `role`, timestamps.

---

## 🏗️ Phased Implementation Plan

Please follow this phased sequence. Complete **Phase 1** first, verify it, and pause for approval before continuing:

- **Phase 1: Backend Foundation & Database Layer**
  - MongoDB connection utility with connection pooling/caching.
  - User and Car Mongoose schemas/models.
  - NextAuth.js configuration (Google + Credentials) and auth route handlers.
  - Car catalog REST API / Server Action with filtering, sorting, and pagination logic.
  - Seed script with mock rental car data to populate MongoDB.

- **Phase 2: Authentication UI & State**
  - Integrate designs from `design/morent_login_page/` and `design/morent_register_page/`.
  - Connect forms with NextAuth actions, loading states, and error toasts.

- **Phase 3: Catalog & Discovery UI**
  - Implement Home page from `design/morent_home_page/`.
  - Implement Vehicles Catalog page with interactive sidebar filters, sort dropdown, and pagination from `design/morent_vehicles_catalog_page/`.
  - Implement dynamic frontend image resolver linking car identifiers to local asset placeholders.

- **Phase 4: Car Detail & Reservation Flow**
  - Implement Car Detail page from `design/morent_car_detail_page/`.
  - Build booking date-selection and summary interface (with dummy payment placeholder).

---

## 🏁 Starting Step

Start by generating **Phase 1**: Set up the MongoDB connection helper, the `User` and `Car` models, the NextAuth configuration, and the car listing API with filtering/pagination.
