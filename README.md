# Collection Management System

A modern full-stack application for managing collections with real-time updates, comprehensive API documentation, and advanced security features.

## Features

- **Real-time Updates**: WebSocket integration for live collaboration
- **RESTful API**: Comprehensive API with auto-generated documentation
- **Interactive Documentation**: Swagger UI and ReDoc interfaces
- **Security**: Input validation
- **Modern UI**: Responsive React frontend with real-time notifications
- **Professional Logging**: Structured logging with database storage

## Architecture

- **Backend**: Django + Django REST Framework + Django Channels
- **Frontend**: React + TypeScript + Vite
- **Real-time**: WebSockets via Django Channels
- **Database**: SQLite (development)
- **API Documentation**: OpenAPI 3.0 with drf-spectacular

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- Git

## 🛠️ Backend Setup

### 1. Clone and Navigate to Backend

```bash
git clone [<repository-url>](https://github.com/sejoonpark99/myChoice.git)
cd myChoice/backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv env

# Activate virtual environment
# On Windows:
env\Scripts\activate
# On macOS/Linux:
source env/bin/activate
```

### 3. Install Dependencies

```bash
# Install Python packages
pip install django djangorestframework channels drf-spectacular

# Verify installation
pip list | grep -E "(django|channels|spectacular)"
```

### 4. Database Setup

```bash
# Apply migrations
python manage.py makemigrations
python manage.py migrate
```

### 5. Start the Server

**Important**: Use `daphne` instead of the standard Django server to enable WebSocket support

```bash
# Install daphne if not already installed
pip install daphne

# Start server with ASGI support (required for WebSockets)
python -m daphne -p 8000 core.asgi:application
```

### 7. Verify Backend Setup

Visit these URLs to confirm everything is working:

- **API Base**: http://localhost:8000/api/collections/
- **Admin Panel**: http://localhost:8000/admin/
- **API Documentation (Swagger)**: http://localhost:8000/api/docs/
- **API Documentation (ReDoc)**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
# From project root
cd frontend
```

### 2. Install Dependencies

```bash
# Install Node.js packages
npm install
```

### 3. Environment Configuration

Create a `.env` file in the frontend directory:

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Start Development Server

```bash
# Start Vite development server
npm run dev
```

The frontend will be available at: http://localhost:5173

### 5. Verify Frontend Setup

- Visit http://localhost:5173
- Check browser console for any errors
- Verify API connectivity by loading items list

## WebSocket Configuration

### Backend WebSocket Setup

The WebSocket server runs automatically when using `daphne`. WebSocket endpoints:

- **Items Updates**: `ws://localhost:8000/ws/items/`

### Frontend WebSocket Integration

WebSockets are automatically configured in the React app. The connection status is shown in the UI:

- 🟢 **Live**: Connected and receiving real-time updates
- 🔴 **Offline**: Disconnected (automatic reconnection attempts)

### Testing WebSockets

1. **Open two browser tabs** with the application
2. **Create/edit/delete items** in one tab
3. **Observe real-time updates** in the other tab

**Manual Testing**:

```javascript
// In browser console
const ws = new WebSocket("ws://localhost:8000/ws/items/");
ws.onopen = () => console.log("Connected");
ws.onmessage = (event) => console.log("📨 Message:", JSON.parse(event.data));
```

## 📚 API Documentation

### Swagger UI

Visit **http://localhost:8000/api/docs/** for interactive API documentation

### ReDoc

Visit **http://localhost:8000/api/redoc/** for alternative documentation

## 🔧 Development Workflow

### Starting Development

```bash
# Terminal 1: Backend (in backend/ directory)
python -m daphne -p 8000 core.asgi:application

# Terminal 2: Frontend (in frontend/ directory)
npm run dev
```

### Making Changes

**Backend Changes**:

- Restart daphne server for code changes
- Run migrations after model changes: `python manage.py makemigrations && python manage.py migrate`

**Frontend Changes**:

- Vite hot-reloads automatically
- No restart needed for most changes

## Quick Start Summary

```bash
# Backend
cd backend
python -m venv env
env\Scripts\activate  # Windows
pip install django djangorestframework channels drf-spectacular daphne
python manage.py migrate
python -m daphne -p 8000 core.asgi:application

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Thanks!**
