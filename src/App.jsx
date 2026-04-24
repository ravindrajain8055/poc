import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import DemoPage from './pages/DemoPage';
import Chatbot from './components/chat/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/marketplace" element={<DemoPage />} />
        </Routes>
        <Chatbot />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
