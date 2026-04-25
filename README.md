# UrbanRoots 🌿

**UrbanRoots** is a community-driven platform designed to promote urban gardening, sustainability, and local food production. It connects urban residents with community gardens, enables plant trading, and provides resources for greener city living.

![UrbanRoots Preview](frontend/images/garden-hero.png)

## 🚀 Features

### 🏡 Garden Management
- **Discover Gardens**: Explore local community gardens via an interactive map.
- **Register Your Space**: List your own rooftop, balcony, or backyard garden.
- **Visit Scheduling**: Check opening/closing times and entry details.
- **Photo Slideshows**: View beautiful galleries of each garden space.

### 🛒 Plant Marketplace
- **Buy & Sell**: List your extra plants, seeds, or gardening tools for sale or trade.
- **Contact Sellers**: Direct messaging/inquiry system to facilitate trades.
- **In-Stock Tracking**: Manage your listings with stock availability status.

### 📸 Community Feed
- **Share Your Progress**: Post photos and videos of your plants.
- **Interactive Slideshows**: Support for multiple media files in a single post (Instagram-style).
- **Engage**: Like and comment on posts from your fellow gardeners.

### 🤖 AI Botanical Assistant (Groot)
- **Instant Advice**: Get gardening tips and plant care instructions from our AI assistant.
- **Identification**: Ask questions about plant health and identification.

### 📅 Events & Workshops
- **Join Events**: Stay updated on local gardening workshops and community meetups.
- **Organize**: Create your own events to invite others to your garden.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Media Storage**: ImageKit.io.
- **Authentication**: JSON Web Tokens (JWT).
- **Real-time Notifications**: Custom JavaScript notification system.

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/HarshThakur2580/UrbanRoots.git
cd UrbanRoots
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend` directory based on the provided `.env.example`:
```bash
cp .env.example .env
```
Fill in your credentials for:
- MongoDB URI
- JWT Secret
- Razorpay Keys (optional for marketplace)
- ImageKit Keys (required for photo uploads)
- Gmail App Password (for email notifications)
- GROQ/Mistral API Keys (for AI assistant)

### 4. Run the Application
Start the backend server:
```bash
npm run dev
```
Open `frontend/index.html` in your browser (use a local server like Live Server in VS Code for best results).

---

## 📂 Project Structure

```text
UrbanRoots/
├── backend/
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # Express API Endpoints
│   ├── middleware/     # Auth & Error handling
│   ├── utils/          # Helpers (Email, ImageKit)
│   └── server.js       # Entry point
├── frontend/
│   ├── css/            # Global styles
│   ├── js/             # Frontend logic (navbar, auth, etc.)
│   ├── images/         # Static assets
│   ├── gardens.html    # Garden directory
│   ├── marketplace.html # Plant trading
│   ├── feed.html       # Social feed
│   └── index.html      # Landing page
└── .gitignore          # Git exclusion rules
```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

---
*Created with ❤️ for a greener planet.*
