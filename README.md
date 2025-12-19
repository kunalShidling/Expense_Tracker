# Expense Tracker

A full-stack expense tracking application with AI-powered predictions.

## Features

- 🔐 User authentication (signup/login with JWT)
- 💰 Expense management (create, read, update, delete)
- 📁 Custom categories
- 🤖 AI-powered expense predictions using Google Gemini
- 📊 Dashboard with expense overview
- 🗄️ CouchDB for data persistence

## Tech Stack

**Backend:**
- Node.js + Express
- CouchDB (nano)
- JWT authentication
- Google Generative AI (Gemini)

**Frontend:**
- React 18
- React Router
- Vite
- Vanilla CSS

## Prerequisites

- Node.js (v16 or higher)
- CouchDB (running on localhost:5984)
- Google Gemini API key (for AI features)

## Installation

### 1. Clone and Setup

```bash
cd expense_tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:

```env
PORT=4000
COUCHDB_URL=http://admin:your_password@localhost:5984
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Initialize databases:

```bash
npm run setup
```

Start backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or similar Vite port)

## Usage

1. **Signup/Login**
   - Navigate to the Login page
   - Create a new account or login
   - You'll be redirected to the Dashboard

2. **Manage Categories**
   - Go to Categories page
   - Add custom expense categories
   - Delete categories as needed

3. **Add Expenses**
   - Click "Add Expense"
   - Enter amount and select category
   - Expenses appear on Dashboard

4. **View Dashboard**
   - See all your expenses
   - Delete expenses with one click

5. **AI Predictions**
   - Go to "AI Predict" page
   - Click "Predict" to get AI-powered spending analysis
   - View predicted next month expenses and recommendations

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses (requires auth)
- `POST /api/expenses` - Create expense (requires auth)
- `PATCH /api/expenses/:id` - Update expense (requires auth)
- `DELETE /api/expenses/:id` - Delete expense (requires auth)

### Categories
- `GET /api/categories` - Get all categories (requires auth)
- `POST /api/categories` - Create category (requires auth)
- `PATCH /api/categories/:id` - Update category (requires auth)
- `DELETE /api/categories/:id` - Delete category (requires auth)

### AI
- `POST /api/ai/predict` - Get AI expense prediction (requires auth)

## Project Structure

```
expense_tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── expensesController.js
│   │   │   ├── categoriesController.js
│   │   │   └── aiController.js
│   │   ├── middlewares/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── expenseRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   └── ai.js
│   │   ├── utils/
│   │   ├── couchdb.js
│   │   ├── index.js
│   │   └── setup.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── api/
│   │   │       └── apiClient.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddExpense.jsx
│   │   │   ├── Categories.jsx
│   │   │   └── Predict.jsx
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Troubleshooting

### CouchDB Connection Issues
- Ensure CouchDB is running: `curl http://localhost:5984`
- Check credentials in `.env` file
- Run `npm run setup` to create databases

### Authentication Issues
- Clear localStorage in browser
- Check JWT_SECRET is set in backend `.env`
- Ensure token is being sent in requests

### AI Prediction Not Working
- Verify GEMINI_API_KEY is valid
- Check API quota limits
- Ensure you have expenses data to analyze

## Bug Fixes

See [BUGFIXES.md](./BUGFIXES.md) for detailed list of resolved issues.

## License

MIT

## Author

Expense Tracker App


_____________________________________

Yet to implementation

Auto add on the expense after the fetching the 
notification of any payment notification auto 
adds on in to the expense tracker..
#

