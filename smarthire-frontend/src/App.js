import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import AIAssistant from './pages/AIAssistant';
import './index.css';


function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={isLoggedIn ? <Jobs /> : <Navigate to="/login" />} />
            <Route path="/ai" element={isLoggedIn ? <AIAssistant /> : <Navigate to="/login" />} />
          <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;