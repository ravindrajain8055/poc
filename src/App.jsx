import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import DemoPage from './pages/DemoPage';
import StartDataIngestion from './pages/StartDataIngestion';
import MyIngestionStatus from './pages/MyIngestionStatus';
import Chatbot from './components/chat/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/marketplace" element={<DemoPage />} />
          <Route path="/data-ingestion" element={<StartDataIngestion />} />
          <Route path="/my-ingestion" element={<MyIngestionStatus />} />
        </Routes>
        <Chatbot />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
