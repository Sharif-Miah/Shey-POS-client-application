# FreshPOS – Modern Cloud Point of Sale (POS) & Retail Management System

![FreshPOS](https://images.unsplash.com/photo-1556742049-0a67e5572293?w=1200&auto=format&fit=crop&q=80)

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%207-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux](https://img.shields.io/badge/State-Redux%20Toolkit-764ABC?logo=redux&logoColor=white)](https://redux.js.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Server-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe%20Checkout-008CDD?logo=stripe&logoColor=white)](https://stripe.com/)
[![Ant Design](https://img.shields.io/badge/UI%20Library-Ant%20Design%205-0170FE?logo=antdesign&logoColor=white)](https://ant.design/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🌟 Live Demo
- **Frontend App:** [https://shey-pos-client-application.vercel.app](https://shey-pos-client-application.vercel.app)
- **Backend API:** `https://shey-pos-server-psi.vercel.app`

---

## 📖 Overview
**FreshPOS** is a full-stack, cloud-based Point of Sale (POS) and inventory management web application designed for retail stores and supermarkets. It streamlines daily store operations by facilitating rapid product checkout, dynamic category filtering, dual-mode billing (Cash & Stripe Card payments), real-time inventory management, printable thermal receipts, and digital mobile invoice verification via QR code scanning.

---

## ✨ Key Features

### 🛒 1. Smart Point of Sale (POS) & Cart
- **All Products Default View:** Instant access to all inventory items upon loading.
- **Dynamic Category Filtering:** One-click filtering across categories (*Fruits*, *Vegetables*, *Meat*).
- **Live Search Bar:** Instant product filtering by name.
- **Interactive Cart & Steppers:** Real-time quantity adjustment (`+` / `-`), line-item calculation, automatic subtotal, and 10% tax calculation using Redux Toolkit.
- **Cart Badge Counter:** Live synchronization of total items across the header and mobile bottom menu.

### 💳 2. Dual Payment Processing (Cash & Stripe)
- **Stripe Hosted Checkout:** Secure online credit/debit card payment integration with automatic redirection.
- **Traditional Cash Mode:** Instant cash checkout with order recording.
- **Automatic Order Fulfillment:** Automated cart clearing and customer bill generation upon verified payment.

### 📦 3. Product & Inventory Management
- **Full CRUD Capabilities:** Add new products with image URLs, edit pricing/categories, or remove items with confirmation modals.
- **Stock Dashboard:** Real-time inventory overview and category metrics.

### 📄 4. Thermal Invoices & Dynamic QR Code Verification
- **Thermal Printable Receipts:** Store branding, itemized table, tax breakdown, and one-click print engine (`react-to-print`).
- **Dynamic QR Code Scanner:** Every receipt features a QR code linking to a public digital invoice (`/invoice/:id`) for mobile verification.

### 📱 5. 100% Mobile-First Responsive Design
- **Native Bottom Navigation Bar:** Sleek, fixed mobile bottom menu with active tab indicators and real-time badge count.
- **Touch-Friendly Cart Cards:** Clean mobile cards replacing wide desktop tables on small screens.

### 🔒 6. Authentication & Security
- **Email & Password Authentication:** Form validation with Ant Design and secure JWT backend verification.
- **Protected Routes:** Route guard system protecting dashboard endpoints from unauthorized access.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 7, Redux Toolkit, React Router 7, Ant Design 5, React Toastify |
| **Backend** | Node.js, Express.js, Mongoose ODM, Dotenv, CORS |
| **Database** | MongoDB Atlas (Cloud Database) |
| **Payment Gateway** | Stripe Checkout API |
| **Document/Print** | React-To-Print, Ant Design QRCode |
| **Deployment** | Vercel (Frontend & Serverless Backend) |

---

## 📂 Project Structure

```bash
Shey-POS-client-application/
├── public/
├── src/
│   ├── components/
│   │   ├── DefaultLayout.jsx     # Responsive Layout, Sider & Mobile Bottom Nav
│   │   └── Items.jsx             # Product Grid Card Component
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx         # Email/Password Login
│   │   │   └── Register.jsx      # User Registration
│   │   ├── Homepage.jsx          # POS Catalog, Category Tabs & Search
│   │   ├── CartPage.jsx          # Order Checkout & Charge Bill Modal
│   │   ├── Items.jsx             # Product Inventory Management Table
│   │   ├── Bills.jsx             # Invoices History, Print Receipt & QR Code
│   │   ├── Customers.jsx         # Customer Directory & Order Analytics
│   │   └── PublicInvoice.jsx     # Standalone QR Mobile Digital Receipt
│   ├── redux/
│   │   ├── rootReducer.js        # Cart & Loading State Reducers
│   │   └── store.js              # Redux Store Configuration
│   ├── resursers/
│   │   ├── authentication.css    # Split-card Auth Styles
│   │   ├── item.css              # Product, Cart, and Modal Styles
│   │   └── layout.css            # Header, Sidebar & Bottom Nav Styles
│   ├── App.jsx                   # Routing & Protected Routes
│   └── main.jsx                  # Application Entrypoint
├── vercel.json                   # Vercel SPA & API Proxy Rewrites
├── vite.config.js                # Vite Proxy & Build Configurations
└── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/shey-pos-client-application.git
cd shey-pos-client-application
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Proxy / Environment
In `vite.config.js`, verify the backend proxy target:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000', // Or your live backend URL
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
