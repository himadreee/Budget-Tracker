# Budget Tracker

A modern, full-stack personal finance tracker built with React, TypeScript, Tailwind CSS, FastAPI, and MongoDB. Secure authentication, beautiful UI, and real-time analytics help you manage your income and expenses with ease.

---

## 🚀 Features

- **User Authentication**: Secure JWT-based login, registration, and session management
- **Refresh Tokens**: Automatic token renewal for seamless user experience
- **Personalized Dashboard**: Visual summary of income, expenses, and balance
- **Transaction Management**: Add, edit, delete, and filter transactions by type, category, and date
- **Data Visualization**: Interactive charts for financial trends
- **Responsive UI**: Modern, mobile-friendly design with Tailwind CSS
- **Role-based Data Isolation**: Each user sees only their own data
- **Environment Variable Management**: Secure handling of secrets and database URIs
- **CORS & Security**: Proper backend CORS configuration for safe API access

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: FastAPI, Python, Pydantic, JWT, bcrypt
- **Database**: MongoDB (Atlas or local)
- **Other**: Axios, React Context API, Lucide React Icons

---

## 📦 Project Structure

```
Budget-Tracker/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── server/           # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   └── models/
│   ├── requirements.txt
│   └── ...
├── .env              # Environment variables (never commit to git)
├── .gitignore
└── README.md
```

---

## ⚡ Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/yourusername/Budget-Tracker.git
cd Budget-Tracker
```

### 2. Setup Environment Variables
Create a `.env` file in the root with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Install Dependencies
#### Backend
```sh
cd server
pip install -r requirements.txt
```
#### Frontend
```sh
cd ../client
npm install
```

### 4. Run the Application
#### Backend (FastAPI)
```sh
cd server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
#### Frontend (React)
```sh
cd client
npm run dev
```

- Frontend: http://localhost:5173 (or 5174)
- Backend:  http://localhost:8000

---

## 🔒 Security & Best Practices
- **Never commit `.env` or `node_modules` to git**
- **Passwords are hashed with bcrypt**
- **JWT tokens are stored securely and refreshed automatically**
- **CORS is configured for safe cross-origin requests**

---

## 📝 Project Highlights
- Solved CORS and authentication issues for smooth full-stack integration
- Implemented robust JWT/refresh token system
- Modern, responsive UI with glassmorphism and subtle animations
- Clean codebase with clear separation of concerns

---

## 📄 License
MIT

---

## 🙋‍♂️ Author
- [Your Name](https://github.com/yourusername)