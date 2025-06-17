import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ItemsListPage from './pages/ItemsListPage';
import CreateItemPage from './pages/CreateItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import EditItemPage from './pages/EditItemPage';
import NotFoundPage from './pages/NotFoundPage';
import LogsPage from './pages/LogsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ItemsListPage />} />
            <Route path="/items" element={<ItemsListPage />} />
            <Route path="/items/new" element={<CreateItemPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/items/:id/edit" element={<EditItemPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;