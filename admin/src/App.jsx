import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Import Layout & Auth
import AdminLayout from './components/common/AdminLayout';
import Login from './pages/auth/Login';

// 2. Import các trang Admin
import Products from './pages/admin/products/index';
import Orders from './pages/admin/orders/Orders';
import Customers from './pages/admin/customers/Customers';
import Marketing from './pages/admin/marketing/Marketing';
import Content from './pages/admin/content/Content';

// 3. Import các trang MỚI THÊM
import Reports from './pages/admin/Reports/Reports';
import Settings from './pages/admin/settings/Settings';
import Dashboard from './pages/admin/dashboard/Dashboard';

// 🔥 IMPORT TRANG KHO HÀNG
import Inventory from './pages/admin/inventory/Inventory';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* === PUBLIC ROUTES === */}
        {/* Đường dẫn Login Trực tiếp tại Root */}
        <Route path="/" element={<Login />} />

        {/* Support legacy paths */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/admin/login" element={<Navigate to="/" replace />} />

        {/* === ADMIN ROUTES === */}
        {/* Layout không có path, bọc các route con */}
        <Route element={<AdminLayout />}>

          {/* Nếu vào path ảo nào đó muốn redirect về dashboard thì thêm logic here, 
              nhưng giờ /dashboard đã là chuẩn */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />

          {/* Route Kho hàng */}
          <Route path="inventory" element={<Inventory />} />

          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />

          <Route path="marketing" element={<Marketing />} />
          <Route path="content" element={<Content />} />

          {/* Các trang báo cáo & cấu hình */}
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />

        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<div style={{ padding: 50, textAlign: 'center' }}><h2>404 - Không tìm thấy trang</h2></div>} />
      </Routes>
    </div>
  );
}

export default App;